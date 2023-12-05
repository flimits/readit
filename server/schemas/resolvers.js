const { User, Post } = require("../models");
const { ObjectId } = require('bson');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate("posts");
    },
    getUser: async (parent, { userId }) => {
      return await User.findById(new ObjectId(userId)).populate("posts");
    },
    posts: async () => {
      return await Post.find();
    },
    getPost: async (parent, { postId }) => {      
      return await Post.findById(new ObjectId(postId))
    }
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
    editPost: async (parent, { postId, newTitle, newText }) => {
      return await Post.findByIdAndUpdate(
        new ObjectId(postId),
        {
          $set: {
            title: newTitle,
            postText: newText
          }
        },
        { new: true } // Return the updated post
      )
    },
    addComment: async (parent, { postId, ...newComment }) => {
      return await Post.findByIdAndUpdate(
        new ObjectId(postId),
        { $push: { comments: newComment } },
        { new: true }
      )
    },
    addReactionToPost: async (parent, { postId, ...newReaction }) => {
      try {
        const post = await Post.findById(new ObjectId(postId));
        const reactions = post.reactions;

        if (reactions.length > 0) {
          const didUserReact = reactions.filter((reaction) => reaction.userId === newReaction.userId)
  
          if (!didUserReact[0]) {
            console.log("user already reacted so we remove it")
          }

          return
        }
        

        return await Post.findByIdAndUpdate(
          new ObjectId(postId),
          { $push: { reactions: newReaction } },
          { new: true }
        )
      } catch (error) {
        console.log("Couldn't add reaction to post");
        console.error(error);
      }


    },
    addReactionToComment: async (parent, { postId, commentId, ...newReaction }) => {
      // set variables to use the postId AND commentId in the query in one go.
      const multipleIdFilter = { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) }

      return await Post.findOneAndUpdate(
        multipleIdFilter,
        {
          $push: { 'comments.$.reactions': newReaction }
        },
        { new: true }
      )
    }
  }
};

module.exports = resolvers;
