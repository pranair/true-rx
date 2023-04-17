from flask import Flask, render_template, request, jsonify, Response
from kombu.simple import SimpleBuffer
import qrcode
import string
import random
import kombu
import json

app = Flask(__name__)

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/api/patient/gen_qr")
# @app.route("/api/patient/qrcode")
def patient_qr():
    k = id_generator()
    connection = kombu.Connection("amqp://localhost:5672/")
    channel = connection.channel()
    queue = SimpleBuffer(channel, k)
    return jsonify({"id": k})

@app.route('/api/patient/verify_qr/<uid>')
# @app.route('/api/patient/qrcode', methods=["POST"])
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
# @app.route("/api/patient/add", methods=["POST"])
def patient_addq():
    if request.method == 'POST':
        print(request.method)
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
def get_patient():
    pass

if __name__ == "__main__":
    app.run()
