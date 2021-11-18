//make sure to use HTTPs
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 80;
let inUse = false;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/system/role', (req, res) => {
  let validation = req.body;
  console.log(req.body)
  fs.readFile('./server/users.json', async (err, data) => {
    if (err) console.log(err);
    let userList = JSON.parse(data.toString('utf-8'));
    for (let user of userList) {
      if (user['username'] == validation['username'] && user['password'] == validation['password']) {
        res.send(true);
        console.log('yes')
      } else {
        res.send(false)
      }
    }
  })
})

app.post('/system/role/user/', (req, res)=>{

})
//Following part should be hooked up with the pi, once it is set
app.get('/system/role/admin/turntablestatus', async(req, res)=>{
  res.send({
    azimuth: 180,
    altitude: 20
  })
})

app.post('/system/role/admin/turntable/azimuth', (req, res)=>{
  let updatedAz = req.body['az'];
  updatedAz = Number(updatedAz);
  if(updatedAz>0 && updatedAz<360){
    res.send('updateds');
    console.log('send to pi')
  }else{
    res.send(false);
    console.log('access denied')
  }
});

app.post('/system/role/admin/turntable/altitude', (req, res)=>{
  let updatedAl = req.body['al'];
  updatedAl = Number(updatedAl);
  if(updatedAl>0 && updatedAl<360){
    res.send('updated');
    console.log('send to pi')
  }else{
    res.send(false);
    console.log('access denied')
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));