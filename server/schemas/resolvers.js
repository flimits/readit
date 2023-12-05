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
          // Find if the user has already reacted or not
          const didUserReact = reactions.filter((reaction) => new ObjectId(newReaction.userId).equals(reaction.userId))

          if (didUserReact[0]) {
            // Remove the user's reaction
            const userId = didUserReact[0].userId
            return await Post.findByIdAndUpdate(
              new ObjectId(postId),
              {
                $pull: {
                  reactions: { userId: new ObjectId(userId) }
                }
              },
              { new: true }
            )
          }

          return
        }

        // Add reaction to post
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
      console.log("@addReactionToComment")
      try {
        // set variables to use the postId AND commentId in the query in one go.
        const multipleIdFilter = { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) }

        const post = await Post.findById(new ObjectId(postId));
        const comments = post.comments;
        const reactions = comments.filter((comment) => comment.id === commentId)[0].reactions

        if (reactions.length > 0) {
          // Find if the user has already reacted or not
          const didUserReact = reactions.filter((reaction) => new ObjectId(newReaction.userId).equals(reaction.userId))

          if (didUserReact[0]) {
            // Remove the user's reaction from the comment
            const userId = didUserReact[0].userId
            
            return await Post.findOneAndUpdate(
              multipleIdFilter,
              {
                $pull: { 
                  'comments.$.reactions': { userId: new ObjectId(userId) } 
                }
              },
              { new: true }
            )
          }

          return
        }

        // Add reaction to comment
        return await Post.findOneAndUpdate(
          multipleIdFilter,
          {
            $push: { 'comments.$.reactions': newReaction }
          },
          { new: true }
        )
      } catch (error) {
        console.log("Couldn't add reaction to comment");
        console.error(error);
      }
    }
  }
};

module.exports = resolvers;
