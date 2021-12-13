const encoder = require('nodary-encoder');
const Gpio = require('onoff').Gpio;
const STEP_PER_REVO = 512;
const ANGLE_PER_STEP = 360 / STEP_PER_REVO;
const ANGLE_PER_PULSE = 1.8;
const azEncoder = encoder(17, 27);
const altEncoder = encoder(22, 23);
const io = require('socket.io-client');
const socket = io('https://bx2027.itp.io');
const azMotor = [14, 15], altMotor = [20, 21];

socket.on('connection', ()=>{
    console.log('Connected to the server');
})

socket.on('update', e=>{
    console.log(e);
})

