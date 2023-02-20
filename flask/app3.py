from flask import Flask, render_template, request, jsonify
import qrcode
import string
import random
import kombu
from kombu.simple import SimpleBuffer

# connection = kombu.Connection("amqp://localhost:5672/")
# channel = connection.channel()
queue_name = ""

app = Flask(__name__)

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/")
def index():
    return "Hello World!"

@app.route("/pharm/is_empty", methods=['POST'])
def pharm_is_empty():
    connection = kombu.Connection("amqp://localhost:5672/")
    channel = connection.channel()
    content = request.json
    queue = SimpleBuffer(channel, content["queue"])
    print(queue.qsize())
    if queue.qsize() != 0:
        val = queue.get().body
        print(val)
        queue.close()
        return val
    else:
        return "null"

@app.route("/pharm")
def pharm():
    uniq = id_generator()
    img = qrcode.make(uniq)
    img.save("./static/temp/" + uniq + ".png")
    queue_name = uniq
    return render_template("pharm.html", name=uniq)

@app.route("/patient")
def patient():
    return render_template("patient.html")

@app.route("/patient/add_to_queue", methods=['POST', 'GET'])
def patient_add_to_queue():
    if request.method == 'POST':
        connection = kombu.Connection("amqp://localhost:5672/")
        channel = connection.channel()
        content = request.json
        queue = SimpleBuffer(channel, content["queue"])
        if queue.qsize() == 0:
            print(content)
            queue.put(content["id"])
            queue.close()
    return jsonify({})

if __name__ == "__main__":
    app.run()
    channel.close()
    connection.release()