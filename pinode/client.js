const io = require('socket.io-client');
const socket = io('https://bx2027.itp.io');
const encoder = require('nodary-encoder');
const Gpio = require('onoff').Gpio;
//encoder
const STEP_PER_REVO = 512;
const ANGLE_PER_STEP = 360 / STEP_PER_REVO;
//stepper
const ANGLE_PER_PULSE = 1.8;
const azStep = new Gpio(14, 'out');
const azDir = new Gpio(15, 'out');
const altStep = new Gpio(14, 'out');
const altDir = new Gpio(15, 'out');
const currentAz = 0;
const currentAlt = 180;
const azEncoder = encoder(17, 27);
const altEncoder = encoder(22, 23);
socket.on('connection', () => {
    console.log('connected to server!')
})

socket.on('update', e => {
    console.log(e);
})
socket.on('updateAzAlt', e => {
    console.log(e);
    const tasks = JSON.parse(e);
    console.log(tasks);
    let bundles = tasks[tasks.length - 1];
    for (let task of bundles) {
        let deltaAz = currentAz - task['az'];
        let deltaAlt = currentAlt - task['alt'];
        if (deltaAlt < 0) {
            altDir.write(1);
        }
        if (deltaAz < 0) {
            azDir.write(1);
        }
        currentAz = task['az'];
        currentAlt = task['alt'];
        setTimeout(() => {
            rotationHanlder(deltaAz, deltaAlt);
        }, 60000)
    }

    azEncoder.on('rotation', (direction, value) => {
        value = value % STEP_PER_REVO;
        console.log('Azimuth Angle is', value * ANGLE_PER_STEP);
    });
    altEncoder.on('rotation', (direction, value) => {
        value = value % STEP_PER_REVO;
        console.log('Altitude Angle is', value * ANGLE_PER_STEP);
    })
})

function rotationHanlder(azDegree, altDegree) {
    let azPulses = Math.ceil(azDegree / ANGLE_PER_PULSE);
    let altPulses = Math.ceil(altDegree / ANGLE_PER_PULSE);
    while (azPulses) {
        setInterval(() => {
            azStep.write(0);
            azStep.write(1);
            azPulses--;
        }, 10)
    }
    while (altPulses) {
        setInterval(() => {
            altStep.write(0);
            altStep.write(1);
            altPulses--;
        }, 10)
    }
}

socket.on('getCurrentPosition', e => {
    socket.emit('currentPos', JSON.stringify({
        az: currentAz,
        alt: currentAlt
    }))
})