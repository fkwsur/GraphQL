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

module.exports = {typeDefs}