const { User, Post } = require("../models");
const { ObjectId } = require('bson');

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
      return await User.create(args);
    },
    addPost: async (parent, args) => {
      // console.log("newpost:", args);
      const newPost = await Post.create(args)

      // Add the new post to the user's document
      await User.findByIdAndUpdate(args.userId,
        { $push: { posts: new ObjectId(newPost.id) } }
      )

      return newPost;
    },
  }
};

module.exports = resolvers;
