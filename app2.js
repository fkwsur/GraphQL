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
    type User {
        idx : Int
        user_id : String
        username : String
        password :String 
    }
    type Query {
       findAll:[User]
       finduser(idx : Int!): User
       createUser(user_id : String!, username:String!, password:String!) : String
    }
`;

const resolvers = {
    Query: {
        async findAll() {
            try {
                const rows = await db.User.findAll();
                let result = [];

                for (let i = 0; i < rows.length; i++) {
                    let simple_json = {
                        idx: rows[i].idx,
                        user_id: rows[i].user_id,
                        username: rows[i].username,
                        password: rows[i].password,
                    };
                    result.push(simple_json);
                }
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        async finduser(_, { idx }) {
            try {
                const rows = await db.User.findOne({
                    where: {
                        idx: idx,
                    },
                });
                let result = {
                    idx: rows.idx,
                    user_id: rows.user_id,
                    username: rows.username,
                    password: rows.password,
                };
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        async createUser(_, { user_id, username, password }) {
            try {
                const rows = await db.User.create({
                    user_id: user_id,
                    username: username,
                    password: password,
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
    finduser(idx : 1){    
        idx,
        user_id,
        username,
        password
    }
}
 * =====graphql query=======
 *  findAll 쓸 때,
 * {   
    findAll{
        idx,
        user_id,
        username,
        password
    }
}
 * =====graphql query=======
  createUser쓸때  //얘는 Mutation 안쓰더라...
  {
    createUser(user_id: "dsddsd3ss", username: "김현지바보", password:"113131") 
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