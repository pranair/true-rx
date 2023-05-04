from flask import Flask, render_template, request, jsonify, Response
from kombu.simple import SimpleBuffer
from datetime import timedelta
import string
import random
import kombu
import psycopg
import random
import datetime

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt

import redis
import json
from redis.commands.search.field import TextField, NumericField, TagField
from redis.commands.search.query import Query

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=1)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)
jwt = JWTManager(app)


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


@app.route("/api/verify_user")
def verify():
    r = redis.Redis(host='localhost', port=6379)
    create = request.args.get("create", None)
    poll = request.args.get("poll", None)
    push = request.args.get("push", None)
    key = request.args.get("key", None)
    if create:
        r.set(create, "")
        return jsonify({"success": True})
    elif push and key:
        if r.get(key) == b'':
            r.set(key, push)
        return jsonify({"success": True})
    elif poll:
        def eventStream():
            while r.get(poll).decode() == "":
                continue
            if r.get(poll) != "":
                yield 'data: %s\n\n' % r.get(poll).decode()
        return Response(eventStream(), mimetype="text/event-stream")
    else:
        return jsonify({"error": True})


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


@app.route("/api/patient", methods=["GET"])
@jwt_required()
def patient_api_home():
    current_user = get_jwt_identity()
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    # medication_query = "SELECT pi.medication_id,m.medication_generic_name,pi.frequency,pi.dosage,pi.days,p.date + pi.days AS due_date FROM  prescription_items pi INNER JOIN medication m ON pi.medication_id = m.medication_id INNER JOIN prescription p ON pi.prescription_id = p.prescription_id WHERE p.status = true AND p.date + pi.days >= NOW() AND p.patient_id = "
    medication_query = """
    SELECT
    	pi.medication_id,
    	m.medication_generic_name,
    	pi.frequency,
    	pi.dosage,
    	pi.days,
    	p.date_given + pi.days AS due_date
    FROM prescription_items pi
    INNER JOIN medication m
    	ON pi.medication_id = m.medication_id
    INNER JOIN prescription p
    	ON pi.prescription_id = p.prescription_id
    WHERE p.status = TRUE
    AND p.date_given + pi.days >= NOW()
    AND p.patient_id = 
    """
    # prescription_query = "select p.prescription_id, d.name, p.date from prescription p join doctor d on p.doctor_id=d.doctor_id join patient r on r.patient_id=p.patient_id where r.patient_id="
    prescription_query = """
    SELECT
    	p.prescription_id,
    	d.name,
    	p.date
    FROM prescription p
    JOIN doctor d
    	ON p.doctor_id = d.doctor_id
    JOIN patient r
    	ON r.patient_id = p.patient_id
    WHERE r.patient_id = 
    """
    out = {}
    index = 0
    print(current_user)

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patient where patient_id=" +
                    str(current_user))
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

# TODO: unify /api/patient into single /api/patient/<email>


@app.route("/api/patient/<uid>", methods=["GET"])
@jwt_required()
def patient_api_home_with_uid(uid):
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    medication_query = """
    SELECT 
        pi.medication_id,
        m.medication_generic_name,
        pi.frequency,
        pi.dosage,
        pi.days,
        p.date_given + pi.days AS due_date 
    FROM  
        prescription_items pi 
        INNER JOIN medication m ON pi.medication_id = m.medication_id 
        INNER JOIN prescription p ON pi.prescription_id = p.prescription_id 
    WHERE 
        p.status = true 
        AND p.date_given + pi.days >= NOW() 
        AND p.patient_id = 
    """
    prescription_query = """
    SELECT
    	p.prescription_id,
    	d.name,
    	p.date
    FROM prescription p
    JOIN doctor d
    	ON p.doctor_id = d.doctor_id
    JOIN patient r
    	ON r.patient_id = p.patient_id
    WHERE r.patient_id = 
    """
    out = {}
    index = 0

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patient where patient_id=" + str(uid))
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        for row in rows:
            for i in row:
                out[colnames[index]] = i
                index += 1

    with conn.cursor() as cur:
        cur.execute(medication_query + str(uid))
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
        cur.execute(prescription_query + str(uid))
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


@app.route("/api/patient", methods=["PUT"])
def add_patient():
    query = """
    INSERT INTO patient (patient_id, name, password, dob, gender, weight, 
            phone_number, email, address, allergies, notes, uid)
    VALUES
    (%s, '%s', '%s', '%s', '%s', %s, %s, '%s', '%s', %s, %s, %s)
    """
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    patient_id = random.randint(10, 1000)
    name = request.json.get("name", None)
    password = request.json.get("password", None)
    dob = request.json.get("date", None)
    gender = request.json.get("gender", None)
    weight = request.json.get("weight", None)
    phone_number = request.json.get("phone", None)
    email = request.json.get("email", None)
    address = request.json.get("address", None)
    allergies = request.json.get("allergies", None)
    notes = request.json.get("notes", None)
    uid = request.json.get("uid", None)
    dob = datetime.datetime.strptime(dob, "%a, %d %b %Y %H:%M:%S %Z")
    print(notes, allergies)
    if allergies == {}:
        allergies = "NULL"
    else:
        allergies = json.dumps(allergies)
        allergies = "'{}'".format(allergies)
    if notes == ['']:
        notes = "NULL"
    else:
        notes = json.dumps(notes)
        notes = "'{}'".format(notes)
        notes = notes.replace('[', '{')
        notes = notes.replace(']', '}')
    print(notes, allergies)
    if patient_id and name and password and dob and gender and weight and \
          phone_number and email and address and notes and uid:
        with conn.cursor() as cur:
            print(query % (patient_id, name, password, dob, gender, weight, phone_number, email, address, allergies, notes, uid))
            cur.execute(query % (patient_id, name, password, dob, gender, weight, phone_number, email, address, allergies, notes, uid))
            conn.commit()
        conn.close()
        return jsonify({"pid": patient_id})
    else:
        return jsonify({"error": True}) 


@app.route("/api/patient/email/<email>")
@jwt_required()
def patient_api_with_email(email):
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    medication_query = """
    SELECT 
        pi.medication_id,
        m.medication_generic_name,
        pi.frequency,
        pi.dosage,
        pi.days,
        p.date_given + pi.days AS due_date 
    FROM  
        prescription_items pi 
        INNER JOIN medication m ON pi.medication_id = m.medication_id 
        INNER JOIN prescription p ON pi.prescription_id = p.prescription_id 
        INNER JOIN patient pa on p.patient_id = pa.patient_id
    WHERE 
        p.status = true 
        AND p.date_given + pi.days >= NOW() 
        AND pa.email like '%s'
    """
    prescription_query = """
    SELECT
    	p.prescription_id,
    	d.name,
    	p.date
    FROM prescription p
    JOIN doctor d
    	ON p.doctor_id = d.doctor_id
    JOIN patient r
    	ON r.patient_id = p.patient_id
    WHERE r.email like '%s'
    """
    out = {}
    index = 0

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM patient where email like '%s' " %
                    str(email))
        colnames = [desc[0] for desc in cur.description]
        rows = cur.fetchall()
        for row in rows:
            for i in row:
                out[colnames[index]] = i
                index += 1

    with conn.cursor() as cur:
        cur.execute(medication_query % str(email))
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
        cur.execute(prescription_query % str(email))
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


@app.route("/api/prescription/medicine/get", methods=["POST"])
def medicine_ajax():
    if request.method == "POST":
        r = redis.Redis(host='localhost', port=6379)
        schema = (
            NumericField("$.ID", as_name="id"),
            TextField("$.producttypename", as_name="otc"),
            TextField("$.proprietaryname", as_name="brand"),
            TagField("$.nonproprietaryname", as_name="generic")
        )
        rs = r.ft("idx:medicine")
        query = request.json.get("query", None)
        if query:
            query = query.strip()
            result = rs.search(Query(query+"*")).docs
            out = {}
            if not result:
                return jsonify({"result": False})
            else:
                for idx, i in enumerate(result):
                    out[str(idx)] = json.loads(i.json)
            ret = {}
            ret["data"] = out
            ret["result"] = True
            r.close()
            return jsonify(ret)
    r.close()
    return jsonify({"result": False})


@app.route("/api/prescription/add", methods=['POST'])  # NOTE: uid is email
@jwt_required()
def prescription_api_home_with_email():
    prescription_query = """
    INSERT INTO prescription (prescription_id, patient_id, doctor_id, date, note, status)
    VALUES
        (%s, %s, %s, '%s', '%s', %s)
    """
    prescription_item_query = """
    INSERT INTO prescription_items (prescription_id, medication_id, frequency, dosage, days)
    VALUES
        (%s, %s, %s, %s, %s)
    """
    patient_id = None
    doctor_id = None
    if request.method == 'POST':
        conn = psycopg.connect(
            "postgresql://root@localhost:26257/truerx?sslmode=disable")
        with conn.cursor() as cur:
            if request.json.get("patient_email", None):
                cur.execute("select patient_id from patient where email like '%s'" %
                            request.json.get("patient_email"))
                patient_id = cur.fetchall()[0][0]
            if request.json.get("patient_email", None):
                cur.execute("select doctor_id from doctor where email like '%s'" %
                            request.json.get("doctor_email"))
                doctor_id = cur.fetchall()[0][0]
            prescription_id = random.randint(10, 1000)
            note = request.json.get("note")
            current_date = str(datetime.date.today())
            cur.execute(prescription_query % (prescription_id,
                        patient_id, doctor_id, current_date, note, 'false'))
            conn.commit()
            for i in request.json['items']:
                medication_id = request.json['items'][i]['id']
                dosage = request.json['items'][i]['dosage']
                days = request.json['items'][i]['days']
                frequency = request.json['items'][i]['frequency']
                cur.execute(prescription_item_query % (
                    prescription_id, medication_id, frequency, dosage, days))
                conn.commit()
            conn.close()
    return jsonify({"id": prescription_id})


@app.route("/api/login/doctor", methods=["POST"])
def doctor_login():
    if request.method == "POST":
        conn = psycopg.connect(
            "postgresql://root@localhost:26257/truerx?sslmode=disable")
        id = request.json.get("id", None)
        password = request.json.get("password", None)
        index = 0
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT password, doctor_id FROM doctor where email like '%s'" % str(id))
                rows = cur.fetchall()
                conn.close()
                if rows == []:
                    return jsonify({"msg": "Bad username or password", "error": "true"}), 401
                else:
                    if password != rows[0][0]:
                        return jsonify({"msg": "Bad username or password", "error": "true"}), 401
                    else:
                        additional_claims = {"usertype": "0"}
                        access_token = create_access_token(
                            identity=str(rows[0][1]), additional_claims=additional_claims)
                        return jsonify(access_token=access_token)
        except:
            return jsonify({"msg": "Unable to connect to database", "error": "true"}), 401

    return jsonify({"msg": "Unable to connect to database", "error": "true"}), 401


@app.route("/api/login/patient", methods=["POST"])
def patient_login():
    if request.method == "POST":
        conn = psycopg.connect(
            "postgresql://root@localhost:26257/truerx?sslmode=disable")
        id = request.json.get("id", None)
        password = request.json.get("password", None)
        with conn.cursor() as cur:
            cur.execute(
                "SELECT password, patient_id FROM patient where email like '%s'" % id)
            rows = cur.fetchall()
            conn.close()
            if rows == []:
                return jsonify({"msg": "Bad username or password", "error": "true"}), 401
            else:
                if password != rows[0][0]:
                    return jsonify({"msg": "Bad username or password", "error": "true"}), 401
                else:
                    additional_claims = {"usertype": "1"}
                    access_token = create_access_token(
                        identity=rows[0][1], additional_claims=additional_claims)
                    return jsonify(access_token=access_token)
    return jsonify({"msg": "Unable to connect to database", "error": "true"}), 401


@app.route("/api/login/pharmacist", methods=["POST"])
def pharmacist_login():
    if request.method == "POST":
        conn = psycopg.connect(
            "postgresql://root@localhost:26257/truerx?sslmode=disable")
        id = request.json.get("id", None)
        password = request.json.get("password", None)
        with conn.cursor() as cur:
            cur.execute(
                "SELECT password, pharmacist_id FROM pharmacist where email like '%s'" % id)
            rows = cur.fetchall()
            conn.close()
            if rows == []:
                return jsonify({"msg": "Bad username or password", "error": "true"}), 401
            else:
                if password != rows[0][0]:
                    return jsonify({"msg": "Bad username or password", "error": "true"}), 401
                else:
                    additional_claims = {"usertype": "2"}
                    access_token = create_access_token(
                        identity=rows[0][1], additional_claims=additional_claims)
                    return jsonify(access_token=access_token)
    return jsonify({"msg": "Unable to connect to database", "error": "true"}), 401


@app.route("/api/doctor/recent/prescriptions", methods=["GET"])
@jwt_required()
def recent_prescriptions():
    claims = get_jwt()
    print(claims)
    if claims["usertype"] != "0":
        return jsonify({"msg": "Bad username or password", "error": "true"}), 401
    ret = {}
    current_user = get_jwt_identity()
    # query = "select p.prescription_id,r.name, p.date from prescription p join doctor d on p.doctor_id=d.doctor_id join patient r on r.patient_id=p.patient_id where d.doctor_id="+current_user
    query = """
    SELECT
      p.prescription_id,
      r.name,
      p.date,
      p.status
    FROM prescription p
    JOIN doctor d
      ON p.doctor_id = d.doctor_id
    JOIN patient r
      ON r.patient_id = p.patient_id
    WHERE d.doctor_id = 
    """
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    with conn.cursor() as cur:
        cur.execute(query+current_user)
        rows = cur.fetchall()
        if len(rows) != 0:
            for idx, el in enumerate(rows):
                print(el)
                temp = {}
                temp["id"] = el[0]
                temp["name"] = el[1]
                temp["date"] = el[2]
                temp["status"] = 'Done' if el[3] == True else 'Pending'
                ret[idx] = temp
        conn.close()
    return jsonify(ret)


@app.route("/api/patient/recent/prescriptions", methods=["GET"])
@jwt_required()
def recent_patient_prescriptions():
    prescription_query = """
    SELECT
    	p.prescription_id,
    	d.name,
    	p.date,
        p.status,
        r.name
    FROM prescription p
    JOIN doctor d
    	ON p.doctor_id = d.doctor_id
    JOIN patient r
    	ON r.patient_id = p.patient_id
    WHERE r.email like '%s'
    """
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    ret = {}
    patient_email = request.args.get("patient", None)
    print(patient_email)
    if not patient_addq:
        return jsonify({"error": True})

    with conn.cursor() as cur:
        cur.execute(prescription_query % patient_email)
        rows = cur.fetchall()
        if len(rows) != 0:
            for idx, el in enumerate(rows):
                print(el)
                temp = {}
                temp["id"] = el[0]
                temp["dname"] = el[1]
                temp["date"] = el[2]
                temp["pname"] = el[4]
                temp["status"] = 'Done' if el[3] == True else 'Pending'
                ret[idx] = temp
        conn.close()
    return jsonify(ret)


@app.route("/api/pharmacist/recent/prescriptions", methods=["GET"])
@jwt_required()
def recent_prescriptions_pharmacist():
    claims = get_jwt()
    print(claims)
    if claims["usertype"] != "2":
        return jsonify({"msg": "Bad username or password", "error": "true"}), 401
    ret = {}
    current_user = get_jwt_identity()
    # query = "select p.prescription_id,r.name, p.date from prescription p join doctor d on p.doctor_id=d.doctor_id join patient r on r.patient_id=p.patient_id where d.doctor_id="+current_user
    query = """
    SELECT
      p.prescription_id,
      r.name,
      p.date,
      p.status
    FROM prescription p
    JOIN pharmacist d
      ON p.pharmacist_id = d.pharmacist_id
    JOIN patient r
      ON r.patient_id = p.patient_id
    WHERE d.pharmacist_id = %s 
    """ % (current_user)
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
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
                temp["status"] = 'Done' if el[3] == True else False
                ret[idx] = temp
        conn.close()
    return jsonify(ret)


@app.route("/api/prescription/<uid>")
@jwt_required()
def view_prescription(uid):
    ret = {}
    # query = "select a.medication_brand_name, a.medication_generic_name, pi.dosage, p.note, pa.name, p.date, pi.days, pa.patient_id, pi.medication_id from prescription p join prescription_items pi on p.prescription_id=pi.prescription_id join medication a on pi.medication_id=a.medication_id join patient pa on p.patient_id=pa.patient_id where p.prescription_id="+uid
    query = """
    SELECT a.medication_brand_name,
           a.medication_generic_name,
           pi.dosage,
           p.note,
           pa.NAME,
           p.date,
           pi.days,
           pa.patient_id,
           pi.medication_id,
           d.name,
           pharm.name
    FROM   prescription p
            JOIN prescription_items pi
             ON p.prescription_id = pi.prescription_id
            JOIN medication a
             ON pi.medication_id = a.medication_id
            JOIN patient pa
             ON p.patient_id = pa.patient_id
            JOIN doctor d
                ON d.doctor_id = p.doctor_id
            LEFT JOIN pharmacist pharm
                ON p.pharmacist_id = pharm.pharmacist_id
    WHERE  p.prescription_id = %s
    """
    conn = psycopg.connect(
        "postgresql://root@localhost:26257/truerx?sslmode=disable")
    with conn.cursor() as cur:
        cur.execute(query % uid)
        rows = cur.fetchall()
        if len(rows) != 0:
            for idx, el in enumerate(rows):
                # print(el)
                temp = {}
                temp["brand"] = el[0]
                temp["generic"] = el[1]
                temp["dosage"] = el[2]
                temp["days"] = el[6]
                temp["medication_id"] = el[8]
                ret[str(idx)] = temp
            ret["note"] = el[3]
            ret["patient"] = el[4]
            ret["date"] = el[5]
            ret["patient_id"] = el[7]
            ret["doctor"] = el[9]
            ret["pharmacist"] = el[10]
        conn.close()
    return jsonify(ret)


@app.route("/api/prescription/<uid>", methods=["PATCH"])
@jwt_required()
def edit_prescription(uid):
    medication_edit_query = """
    UPDATE prescription_items
    SET
        dosage=%s,
        days=%s
    WHERE
        prescription_id=%s
        AND medication_id=%s
    """
    note_edit_query = """
    UPDATE prescription
    SET 
        note=%s
    WHERE
        prescription_id=%s
    """
    issue_query = """
    UPDATE prescription
    SET
        status=%s,
        pharmacist_id=%s,
        date_given=current_date()
    WHERE
        prescription_id=%s
    """
    claims = get_jwt()
    if claims["usertype"] == "0":
        edit_type = request.args.get('type', None)
        conn = psycopg.connect(
            "postgresql://root@localhost:26257/truerx?sslmode=disable")
        with conn.cursor() as cur:
            print(edit_type, edit_type == 'medication')
            if edit_type == 'medication':
                dosage = request.json.get("dosage")
                days = request.json.get("days")
                medication_id = request.json.get("medication_id")
                cur.execute(medication_edit_query,
                            (dosage, days, uid, medication_id))
            elif edit_type == 'note':
                note = request.json.get("note")
                cur.execute(note_edit_query, (note, uid))
            else:
                conn.close()
                return jsonify({"error": "false"})
            conn.commit()
            conn.close()
    elif claims["usertype"] == "2":
        current_pharmacist = get_jwt_identity()
        print(issue_query % ('true', current_pharmacist, uid))
        edit_type = request.args.get('type', None)
        if edit_type == 'issue':
            conn = psycopg.connect(
                "postgresql://root@localhost:26257/truerx?sslmode=disable")
            with conn.cursor() as cur:
                cur.execute(issue_query % ('true', current_pharmacist, uid))
                conn.commit()
                conn.close()
    return jsonify({"error": "false"})


if __name__ == "__main__":
    app.run(debug=True)
