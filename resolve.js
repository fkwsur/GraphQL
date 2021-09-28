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

module.exports = {resolvers}