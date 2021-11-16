//make sure to use HTTPs

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/system/login', (req, res) => {
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

app.listen(port, () => console.log(`Listening on port ${port}`));