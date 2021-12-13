//make sure to use HTTPs
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 80;
const util = require('util');
execPromise = util.promisify(exec);
let inUse = false;
const schedule = require('node-schedule');
const todaySchedule = {};
require('dotenv').config();
const scheduleArray = [];
// let options = {
// 	key: fs.readFileSync('./star_itp_io.key'),
// 	cert: fs.readFileSync('./star_itp_io.pem')
// }
const http = require('http');
const httpServer = http.createServer(app);
const socket = require('socket.io')(httpServer);
app.use(bodyParser.json());
app.use(express.static(getStaticFolderPath()));
app.get('/', (req, res) => {
  res.sendFile(getEntryFilePath())
})
app.use(bodyParser.urlencoded({ extended: true }));
//Following part should be hooked up with the pi, once it is set
app.get('/system/role/admin/turntablestatus', async (req, res) => {
  socket.emit('getCurrentPosition', 1);
  socket.on('currentPos', e => {
    res.send(e);
  })
})
app.get('/system/role/user/APIKEY', (req, res) => {
  console.log(process.env.NASA_API_KEY);
  res.send(JSON.stringify({ key: process.env.NASA_API_KEY }));
})
app.post('/system/role', (req, res) => {
  let validation = req.body;
  console.log(req.body)
  fs.readFile('./users.json', async (err, data) => {
    if (err) console.log(err);
    let userList = JSON.parse(data.toString('utf-8'));
    for (let user of userList) {
      if (user['username'] == validation['username'] && user['password'] == validation['password']) {
        res.send(true);
        console.log('admin successfully login')
      } else {
        res.send(false)
      }
    }
  })
})
//if the system is performing, send to client
app.post('/system/role/user/active', (req, res) => {

})

app.post('/system/role/admin/turntable/azimuth', (req, res) => {
  let updatedAz = req.body['az'];
  updatedAz = Number(updatedAz);
  if (updatedAz > 0 && updatedAz < 360) {
    res.send('updated');
    console.log('send to pi')
  } else {
    res.send(false);
    console.log('access denied')
  }
});

app.post('/system/role/admin/turntable/altitude', (req, res) => {
  let updatedAl = req.body['al'];
  updatedAl = Number(updatedAl);
  if (updatedAl > 0 && updatedAl < 360) {
    res.send('updated');
    console.log('send to pi')
  } else {
    res.send(false);
    console.log('access denied')
  }
})

app.post('/system/role/user/inactive/entity', async (req, res) => {
  const requestBundle = req.body;
  let startTime = requestBundle['startTime'];
  let endTime = requestBundle['endTime'];
  if (validator(startTime, endTime)) {
    scheduleArray.push(startTime);
    startTime = dateFormatter(startTime);
    endTime = dateFormatter(endTime);
    console.log(startTime)
    // request from python
    exec(`${getPythonExePath()} ${getPythonScriptPath()} ${requestBundle.name} ${requestBundle.lat} ${requestBundle.long} ${startTime} ${endTime}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        res.send(false);
      }
      if (stdout) {
        //return is a string
        console.log(stdout);
        let results = stdout.split('\r\n');
        results.pop();

        console.log(results);
        for (let i = 0; i < results.length; i++) {
          let res = results[i].split(' ');
          console.log(res);
          let az = res[0];
          let alt = res[1];
          // console.log(result);
          let azDay = getDay(az);
          let altDay = getDay(alt);
          let azMin = getMinute(az);
          let altMin = getMinute(alt);
          const azAlt = {
            "az": azDay + '.' + azMin,
            "alt": altDay + '.' + altMin
          }
          if (Array.isArray(todaySchedule[`${startTime}`])) {
            todaySchedule[`${startTime}`].push(azAlt);
            // console.log(todaySchedule)
          } else {
            todaySchedule[`${startTime}`] = [azAlt];
          }
        }
        res.send('found');
        fs.writeFile(`./${startTime.split(':')[0]}.json`, JSON.stringify(todaySchedule), (err) => {
          if (err) console.log(err);
        });
        scheduler(startTime.split(':')[0], startTime);
      }
      if (stderr) {
        console.log(stderr)
      }
    })
  } else {
    console.log('Time input not valid')
    res.send('invalid time');
  }

})
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
socket.on('connection', (msg) => {
  console.log('Connection!');
  socket.emit('update', 'hell from the server!');
})

function getDay(str) {
  let dayPattern = /(\d+d)/;
  let res = dayPattern.exec(str)[0]
  return res.slice(0, -1);
}

function getMinute(str) {
  let minutePattern = /(\d+m)/;
  let res = minutePattern.exec(str)[0];
  return res.slice(0, -1);
}

function getPythonDir() {
  let rootPath = __dirname.split("\\");
  rootPath.splice(-2, 2);
  rootPath.push('python');
  let res = rootPath.join('\/');
  return res;
}

function getPythonExePath() {
  let root = getPythonDir();
  if (process.platform === 'win32') {
    root += '/Scripts/python.exe';
    return root;
  } else if (process.platform === 'linux') {
    root += '/bin/python';
    return root;
  }
}

function getPythonScriptPath() {
  let root = getPythonDir();
  root += '/main.py';
  return root;
}

function getStaticFolderPath() {
  let pagePath = __dirname.split('\\');
  pagePath.splice(-1, 1);
  pagePath.push('client', 'build');
  let folderPath = pagePath.join('\/');
  return folderPath;
}

function getEntryFilePath() {
  let pagePath = __dirname.split('\\');
  pagePath.splice(-1, 1);
  pagePath.push('client', 'build', 'index.html');
  let htmlPath = pagePath.join('\/');
  return htmlPath
}

function dateFormatter(time) {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${time}`;
}

//input as string, validate the start time is ealier than endtime
function validator(start, end) {
  const date = new Date();
  const startArray = start.split(':');
  const endArray = end.split(':');
  console.log(startArray, endArray);
  if (startArray[0] > endArray[0]) {
    return false;
  } else if (startArray[0] === endArray[0] && startArray[1] > endArray[1]) {
    return false;
  } else if (startArray[0] < date.getHours()) {
    return false;
  } else if (startArray[0] === date.getHours() && startArray[1] < date.getMinutes()) {
    return false;
  }
  return true;

}
//input time format: HH:MM
// function timer(start, end) {
//   let [startHour, startMinute] = start.split(':');
//   let [endHour, endMinute] = end.split(':');
//   startHour = Number(startHour);
//   startMinute = Number(startMinute);
//   endHour = Number(endHour);
//   endMinute = Number(endMinute);
//   const deltaTime = (endHour - startHour - 1) * 60 + (60 - startMinute) + endMinute;
//   return deltaTime;
// }

function scheduler(name, startTime) {
  console.log(startTime);
  console.log('start creating new job!')
  let newJob = schedule.scheduleJob(startTime, function () {
    let data = fs.readFileSync(`${name}.json`);
    socket.emit('updateAzAlt', data);
    console.log('New Job done!');
  })
  console.log(`New Job created as ${util.inspect(newJob)}`)
}