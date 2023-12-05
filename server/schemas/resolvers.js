const { User, Post } = require("../models");
const { ObjectId } = require('bson');

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find().populate("posts");
      } catch (error) {
        console.log("couldn't get all users")
        console.error(error)
      }
    },
    getUser: async (parent, { userId }) => {
      try {
        return await User.findById(new ObjectId(userId)).populate("posts");
      } catch (error) {
        console.log("couldn't get single user")
        console.error(error)
      }
    },
    posts: async () => {
      try {
        return await Post.find();
      } catch (error) {
        console.log("couldn't get all posts")
        console.error(error)
      }
    },
    getPost: async (parent, { postId }) => {
      try {
        return await Post.findById(new ObjectId(postId))
      } catch (error) {
        console.log("couldn't get single post")
        console.error(error)
      }
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      try {
        return await User.create(args);
      } catch (error) {
        console.log("couldn't add comment")
        console.error(error)
      }
    },
    addPost: async (parent, args) => {
      try {
        const newPost = await Post.create(args)

        // Add the new post to the user's document
        await User.findByIdAndUpdate(args.userId,
          { $push: { posts: new ObjectId(newPost.id) } }
        )

        return newPost;
      } catch (error) {
        console.log("couldn't add comment")
        console.error(error)
      }
    },
    editPost: async (parent, { postId, newTitle, newText }) => {
      try {
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
      } catch (error) {
        console.log("couldn't add comment")
        console.error(error)
      }
    },
    addComment: async (parent, { postId, ...newComment }) => {
      try {
        return await Post.findByIdAndUpdate(
          new ObjectId(postId),
          { $push: { comments: newComment } },
          { new: true }
        )
      } catch (error) {
        console.log("couldn't add comment")
        console.error(error)
      }
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
