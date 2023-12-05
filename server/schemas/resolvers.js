const { User, Post } = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate("posts");
    },
    posts: async () => {
      return await Post.find();
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      // console.log("newUser:", args);
      return await User.create(args)
    },
    
  }
};

module.exports = resolvers;
