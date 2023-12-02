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
};

module.exports = resolvers;
