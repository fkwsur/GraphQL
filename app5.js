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

const typeDefs = `

  type board {
    idx: Int
    username: String
    title: String
    content: String
  }

  type Query {
    getBoardData: [board]
    findBoard(idx : Int!): board
    createBoard(username : String!, title:String!, content:String!) : String
    updateBoard(idx: Int!, username: String!, title: String!, content: String!): String
    deleteBoard(idx: Int!, username: String!, title: String!, content: String!): String
  }
`;
 

const resolvers = {
  Query:  {
    getBoardData: async () => {
    try {
      const getBoard = await db.board.findAll();
      return getBoard;
    } catch (error) {
      console.log(error);
    }
    },
    findBoard: async (_, {idx}) => { 
      try {
      const rows = await db.board.findOne( {where: { idx: idx } });
      let result = {
        idx: rows.idx,
        username: rows.username,
        title: rows.title,
        content: rows.content,
    };
      return result;
    } catch (error) {
      console.log(error);
  }
    },
    createBoard: async (_, { username, title, content }) => {
      try {
      const rows = await db.board.create({ 
        username : username,
        title : title,
        content : content
      });
      if (rows) return "success";
      else return "failed";
     } catch (error) {
      console.log(error);
    }
    },
    updateBoard: async (_, { idx, username, title, content }) => {
      try {
      console.log(idx)
      const rows = await db.board.update({username, title, content}, {where: { idx: idx } });
      if (rows) return "success";
      else return "failed";
    } catch (error) {
      console.log(error);
  }
    },
    deleteBoard: async (_, { idx }) => {
      try {
      const rows = await db.board.destroy({where: { idx: idx } });
      if (rows) return "success";
      else return "failed";
  } catch (error) {
      console.log(error);
  }
    },
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
 
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

