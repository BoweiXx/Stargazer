import socketio;

mySocket = socketio.Client();
mySocket.connect('http://localhost:80');
print('my sid is', mySocket.sid)


@mySocket.event
def connect():
    mySocket.emit('connection','hello from the other side')
    print("Connected!")


@mySocket.event
def connect_error(data):
    print(data)

@mySocket.on('update')
def on_message(data):
    print('got message from server: ', data);

@mySocket.on('updateAzAlt')
def on_message(data):
    print(data);

@mySocket.on('location')
def on_message(data):
    print(data['az'],data['alt'] );