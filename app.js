const express = require('express');
const app = express();
const db = require('./models');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
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

const schema = buildSchema(`
  type Query {
    hello: String,
    fuckyou : String
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  },
  fuckyou: () => {
    return 'fuck~ you~ go~ away~';
  }
};
 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

//using in restapi
app.get("/get_graphql", async (req, res) => {
  try {
      let graphql_api = req.query.api;
      let response = await graphql(schema, `{ ${graphql_api} }`, root);
      res.status(200).send(response);
  } catch (error) {
      console.log(error);
  }
});

console.log('Running a GraphQL API server at http://localhost:8080/graphql');
