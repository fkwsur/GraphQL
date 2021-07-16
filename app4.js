const db = require("./models");
//create dummy user
//password is example, not important in this project
db.sequelize.authenticate().then(async () => {
    try {
        await db.sequelize.sync({ force: false });
    } catch (error) {
        console.log(error);
    }
});

const express = require("express");
const app = express();
const { PORT } = process.env;
const { graphqlHTTP } = require("express-graphql");
const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
} = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
app.use(require("cors")());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

const typeDefs = `
    type board {
        idx : Int
        username : String
        title : String
        content :String 
    }
    type Query {
       findboard(idx : Int!): board
       findAll:[board]
       createBoard(username : String!, title:String!, content:String!) : String
    }
`;

const resolvers = {
    Query: {
        async findboard(_, { idx }) {
            try {
                const rows = await db.board.findOne({
                    where: {
                        idx: idx,
                    },
                });
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
        async findAll() {
            try {
                const rows = await db.board.findAll();
                let result = [];

                for (let i = 0; i < rows.length; i++) {
                    let simple_json = {
                        idx: rows[i].idx,
                        username: rows[i].username,
                        title: rows[i].title,
                        content: rows[i].content,
                    };
                    result.push(simple_json);
                }
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        async createBoard(_, { username, title, content }) {
            try {
                const rows = await db.board.create({
                  username: username,
                  title: title,
                  content: content,
                });
                if (rows) return "success";
                else return "failed";
            } catch (error) {
                console.log(error);
            }
        },
    },
};

/**
 * =====graphql query=======
 *  finduser 쓸 때,
 * {   
    findboard(idx : 1){    
        idx,
        username,
        title,
        content
    }
}
 * =====graphql query=======
 *  findAll 쓸 때,
 * {   
    findAll{
        idx,
        username,
        title,
        content
    }
}
 * =====graphql query=======
  createUser쓸때  //얘는 Mutation 안쓰더라...
  {
    createBoard(username: "aaa", title: "서재용바보", content:"보고있는거아니지..?ㅋ메롱똥개") 
  }
 * 
 */

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);

require("http")
    .createServer(app)
    .listen(PORT || 8080);