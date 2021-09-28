const express = require('express');
const app = express();
const db = require('./models');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require("graphql-tools");
const { buildSchema } = require('graphql');
const dotenv = require('dotenv');
dotenv.config();
const { PORT  } = process.env;
app.use(require("cors")());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

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


 
const {typeDefs} = require('./type');
const {resolvers} = require('./resolve');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

