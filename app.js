const express = require('express');
const app = express();
const db = require('./models');
const dotenv = require('dotenv');
dotenv.config();
const { PORT  } = process.env;

const http_server = require('http')
.createServer(app)
.listen(PORT || 8080, () => {
  console.log('server on');
});


db.sequelize
.authenticate()
.then(async () => {
  try{
    console.log('db connect ok');
    await db.sequelize.sync({force : false});
  }catch(err){
    console.log('err');
  }  
})
.catch(err => {
    console.log('db' + err);
});


app.post('/create', (req, res) => {
  try{

  }catch(err){
    console.log(err);
  }
})