//make sure to use HTTPs
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 80;
let inUse = false;
require('dotenv').config({path: __dirname + '\/\.env'});
let pythonPath = __dirname.split("\\")
pythonPath.splice(-2, 2);
let scriptPath = __dirname.split('\\')
scriptPath.splice(-2, 2);
pythonPath.push('python', 'main.py');
scriptPath.push('python', 'Scripts', 'python.exe');
scriptPath = scriptPath.join('\\');
console.log('script path:' + scriptPath)
pythonPath = pythonPath.join('\\');
console.log('python path:' + pythonPath)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Following part should be hooked up with the pi, once it is set
app.get('/system/role/admin/turntablestatus', async (req, res) => {

})
app.get('/system/role/user/APIKEY',  (req, res) => {
  console.log(process.env.NASA_API_KEY);
  res.send(JSON.stringify({key: process.env.NASA_API_KEY}));
})
app.post('/system/role', (req, res) => {
  let validation = req.body;
  console.log(req.body)
  fs.readFile('./server/users.json', async (err, data) => {
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

app.post('/system/role/user/', (req, res) => {

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
  const requestBundle = req.body
  // request from python
  exec(`${scriptPath} ${pythonPath} ${requestBundle.name} ${requestBundle.lat} ${requestBundle.long}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.send(false);
    }
    if (stdout) {
      inUse = true;
      //return is a string
      console.log(stdout);
      let result = stdout.split(' ');
      let az = result[0];
      let alt = result[1];
      // console.log(result);
      let azDay = getDay(az);
      let altDay = getDay(alt);
      let azMin = getMinute(az);
      let altMin = getMinute(alt);
      const azAlt = {
        "az": azDay + '.' + azMin,
        "alt": altDay + '.' + altMin
      }
      console.log(azAlt)
      res.send('found');
    }
    if (stderr) {
      console.log(stderr)
    }
  })
})
app.listen(port, () => console.log(`Listening on port ${port}`));

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
