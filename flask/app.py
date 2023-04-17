from flask import Flask, render_template, request, jsonify, Response
from kombu.simple import SimpleBuffer
from datetime import timedelta
import string
import random
import kombu
import psycopg

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=1)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/api/patient/gen_qr")
def patient_qr():
    k = id_generator()
    connection = kombu.Connection("amqp://localhost:5672/")
    channel = connection.channel()
    queue = SimpleBuffer(channel, k)
    return jsonify({"id": k})

@app.route('/api/patient/verify_qr/<uid>')
def verify_qr(uid):
    connection = kombu.Connection("amqp://localhost:5672/")
    channel = connection.channel()
    queue = SimpleBuffer(channel, uid)
    def eventStream():
        while queue.qsize() == 0:
            continue
        yield 'data: %s\n\n' % queue.get().body
    return Response(eventStream(), mimetype="text/event-stream")

@app.route("/api/patient/addq", methods=["POST"])
def patient_addq():
    if request.method == 'POST':
        # print(request.method)
        connection = kombu.Connection("amqp://localhost:5672/")
        channel = connection.channel()
        content = request.json
        queue = SimpleBuffer(channel, content["queue"])
        ret = {
                "action": "failure"
        }
        if queue.qsize() == 0:
            queue.put(content["id"])
            queue.close()
            ret["action"] = "success"
    return jsonify(ret)

@app.route("/api/patient")
@jwt_required()
def patient_api_home():
    current_user = get_jwt_identity()
    conn = psycopg.connect("postgresql://root@localhost:26257/truerx?sslmode=disable")
    medication_query = "SELECT pi.medication_id,m.medication_generic_name,pi.quantity,pi.dosage,pi.days,p.date + pi.days AS due_date FROM  prescription_items pi INNER JOIN medication m ON pi.medication_id = m.medication_id INNER JOIN prescription p ON pi.prescription_id = p.prescription_id WHERE p.status = true AND p.date + pi.days >= NOW() AND p.patient_id = "
    prescription_query = "select p.prescription_id, d.name, p.date from prescription p join doctor d on p.doctor_id=d.doctor_id join patient r on r.patient_id=p.patient_id where r.patient_id="
    out = {}
    index = 0
    print(current_user)

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patient where patient_id=" + str(current_user))
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        for row in rows:
            for i in row:
                out[colnames[index]] = i
                index += 1 

    with conn.cursor() as cur:
        cur.execute(medication_query + str(current_user))
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        medication = {}
        for idx1, row in enumerate(rows):
            temp = {}
            for idx2, i in enumerate(row):
                temp[colnames[idx2]] = i
            medication[idx1] = temp
        out["medication"] = medication

    with conn.cursor() as cur:
        cur.execute(prescription_query + str(current_user))
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        pres = {}
        for idx1, row in enumerate(rows):
            temp = {}
            for idx, i in enumerate(row):
                temp[colnames[idx]] = i
            pres[idx1] = temp
        out["prescription"] = pres
    
    conn.close() 
    if out == {}:
        return jsonify({"error": "no such patient"})
    return jsonify(out)
        
@app.route("/api/login/doctor", methods=["POST"])
def doctor_login():
    if request.method == "POST":
        conn = psycopg.connect("postgresql://root@localhost:26257/truerx?sslmode=disable")
        id = request.json.get("id", None)
        password = request.json.get("password", None)
        index = 0
        with conn.cursor() as cur:
            cur.execute("SELECT password FROM doctor where doctor_id=" + str(id))
            rows = cur.fetchall()
            conn.close()
            if rows == []:
                return jsonify({"msg": "Bad username or password", "error":"true"}), 401
            else:
                if password != rows[0][0]:
                    return jsonify({"msg": "Bad username or password", "error":"true"}), 401
                else:
                    additional_claims = {"usertype": "0"}
                    access_token = create_access_token(identity=id, additional_claims=additional_claims)
                    return jsonify(access_token=access_token)
    return jsonify({"msg": "Unable to connect to database", "error":"true"}), 401

@app.route("/api/login/patient", methods=["POST"])
def patient_login():
    if request.method == "POST":
        conn = psycopg.connect("postgresql://root@localhost:26257/truerx?sslmode=disable")
        id = request.json.get("id", None)
        password = request.json.get("password", None)
        with conn.cursor() as cur:
            cur.execute("SELECT password FROM doctor where doctor_id=" + str(id))
            rows = cur.fetchall()
            conn.close()
            if rows == []:
                return jsonify({"msg": "Bad username or password", "error":"true"}), 401
            else:
                if password != rows[0][0]:
                    return jsonify({"msg": "Bad username or password", "error":"true"}), 401
                else:
                    additional_claims = {"usertype": "1"}
                    access_token = create_access_token(identity=id, additional_claims=additional_claims)
                    return jsonify(access_token=access_token)
    return jsonify({"msg": "Unable to connect to database", "error":"true"}), 401

@app.route("/api/doctor/recent/prescriptions", methods=["GET"])
@jwt_required()
def recent_prescriptions():
    claims = get_jwt()
    print(claims)
    if claims["usertype"] != "0":
        return jsonify({"msg": "Bad username or password", "error":"true"}), 401
    ret = {}
    current_user = get_jwt_identity()
    query = "select p.prescription_id,r.name, p.date from prescription p join doctor d on p.doctor_id=d.doctor_id join patient r on r.patient_id=p.patient_id where d.doctor_id="+current_user
    conn = psycopg.connect("postgresql://root@localhost:26257/truerx?sslmode=disable")
    with conn.cursor() as cur:
        cur.execute(query)
        rows = cur.fetchall()
        if len(rows) != 0:
            for idx, el in enumerate(rows):
                print(el)
                temp = {}
                temp["id"] = el[0]
                temp["name"] = el[1]
                temp["date"] = el[2]
                temp["status"] = 'Done'
                ret[idx] = temp
        conn.close()
    return jsonify(ret)

@app.route("/api/prescription/<uid>")
@jwt_required()
def view_prescription(uid):
    ret = {}
    query = "select a.medication_brand_name, a.medication_generic_name, pi.quantity, p.note, pa.name, p.date from prescription p join prescription_items pi on p.prescription_id=pi.prescription_id join medication a on pi.medication_id=a.medication_id join patient pa on p.patient_id=pa.patient_id where p.prescription_id="+uid
    conn = psycopg.connect("postgresql://root@localhost:26257/truerx?sslmode=disable")
    with conn.cursor() as cur:
        cur.execute(query)
        rows = cur.fetchall()
        if len(rows) != 0:
            for idx, el in enumerate(rows):
                # print(el)
                temp = {}
                temp["brand"] = el[0]
                temp["generic"] = el[1]
                temp["strength"] = el[2]
                temp["days"] = "10"
                ret[str(idx)] = temp
            ret["note"] = el[3]
            ret["patient"] = el[4]
            ret["date"] = el[5]
        conn.close()
    return jsonify(ret)

if __name__ == "__main__":
    app.run(debug=True)
