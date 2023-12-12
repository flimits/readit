const { User, Post } = require("../models");
const { ObjectId } = require("bson");
const {
  signToken,
  ErrorAuthentication,
  ErrorLogin,
  ErrorMustBeLoggedIn,
} = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find().populate("posts");
      } catch (error) {
        console.log("couldn't get all users");
        console.error(error);
      }
    },
    getUser: async (parent, { userId }) => {
      try {
        return await User.findById(new ObjectId(userId)).populate("posts");
      } catch (error) {
        console.log("couldn't get single user");
        console.error(error);
      }
    },
    getMe: async (parent, args, context) => {
      // If we know the logged in user is wanting to look at their account, use context
      try {
        // console.log("context.user:", context.user);

        if (context.user) {
          const user = await User
            .findById(new ObjectId(context.user._id))
            .populate({
              path: "posts",
              populate: {
                path: "author",
                select: "userName",
              },
            });

          // console.log("user:", user);
          return user;
        }

        throw ErrorAuthentication;
      } catch (error) {
        console.error("Error in getMe resolver:", error);
      }
    },

    posts: async () => {
      try {
        const posts = await Post.find().populate({
          path: "author",
          select: "userName",
        });
        // console.log("posts:", posts)
        return posts;
      } catch (error) {
        console.log("couldn't get all posts");
        console.error(error);
      }
    },
    getPost: async (parent, { postId }) => {
      try {
        return await Post.findById(new ObjectId(postId))
          .populate({
            path: "author",
            select: "userName",
          })
          .populate({
            path: "comments",
            populate: {
              path: "author",
              select: "userName",
            },
          });
      } catch (error) {
        console.log("couldn't get single post");
        console.error(error);
      }
    },
    searchPosts: async (
      parent,
      { query, filterTitle = true, filterContent = true, filterTags = true }
    ) => {
      try {
        let findQuery = {};

        // If no specific criteria, search all
        if (!filterTitle && !filterContent && !filterTags)
          findQuery = { $text: { $search: query } };
        // Else set the query criteria
        else {
          // Allow querying for multiple keywords separated by whitespace.
          findQuery = {
            $or: query.split(" ").map((keyword) => {
              let queryList = [];
              const regex = { $regex: keyword.trim(), $options: "i" };
              // Add to the list of queries
              if (filterTitle) queryList.push({ title: regex });
              if (filterContent) queryList.push({ postText: regex });
              if (filterTags) queryList.push({ tags: regex });

              return { $or: queryList };
            }),
          };
        }

        // console.log("queryList:", queryList)
        // console.log("full query:", findQuery)

        const posts = await Post.find(findQuery).populate({
          path: "author",
          select: "userName",
        });

        // console.log("posts:", posts);
        return posts;
      } catch (error) {
        console.log(`Couldn't find posts with search: "${query}"`);
        console.error(error);
      }
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.log("couldn't add comment");
        console.error(error);
      }
    },
    login: async (parent, { userName, password }) => {
      try {
        const user = await User.findOne({ userName });

        // Check if user exists
        if (!user) {
          throw ErrorLogin;
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
          throw ErrorLogin;
        }

        const token = signToken(user);
        // console.log(token);
        return { token, user };
      } catch (error) {
        console.log("couldn't login");
        console.error(error);
      }
    },
    addPost: async (parent, args, context) => {
      try {
        // Check if user is logged in
        // if (!context.user) {
        //   throw ErrorMustBeLoggedIn
        // }
        args.author = context.user._id;
        const newPost = await Post.create(args);

        // Add the new post to the user's document
        await User.findByIdAndUpdate(args.author, {
          $push: { posts: new ObjectId(newPost.id) },
        });

        return newPost;
      } catch (error) {
        console.log("couldn't add post");
        console.error(error);
      }
    },
    editPost: async (parent, { postId, newTitle, newText, newTags }, context) => {
      try {
        // console.log("context.user:", context.user);
        //Check if user is logged in
        if (!context.user) {
          throw ErrorMustBeLoggedIn;
        }

        return await Post.findByIdAndUpdate(
          new ObjectId(postId),
          {
            $set: {
              title: newTitle,
              postText: newText,
              tags: newTags
            },
          },
          { new: true } // Return the updated post
        ).populate("author");
      } catch (error) {
        console.log("couldn't edit post");
        console.error(error);
      }
    },
    deletePost: async (parent, { postId }, context) => {
      try {
        // console.log("context.user:", context.user);
        // Check if user is logged in
        if (!context.user) {
          throw ErrorMustBeLoggedIn
        }

        const deletedData = await Post.findByIdAndDelete(new ObjectId(postId), 
          { new: true, }
        );
        // console.log("deletedData ",deletedData);

        // Change a piece of data to trigger React's hook render
        deletedData._id = "";
        return deletedData;
      } catch (error) {
        console.log("couldn't delete post");
        console.error(error);
      }
    },
    addComment: async (parent, { postId, ...newComment }, context) => {
      try {
        // Check if user is logged in
        if (!context.user) {
          throw ErrorMustBeLoggedIn;
        }

        newComment.author = context.user;

        return await Post.findByIdAndUpdate(
          new ObjectId(postId),
          { $push: { comments: newComment } },
          { new: true }
        );
      } catch (error) {
        console.log("couldn't add comment");
        console.error(error);
      }
    },
    editComment: async (parent, { postId, commentId, newText }, context) => {
      try {
        if (!context.user) {
          throw ErrorMustBeLoggedIn;
        }

        const multipleIdFilter = {
          _id: new ObjectId(postId),
          "comments._id": new ObjectId(commentId),
        };

        const updatedPost = await Post.findOneAndUpdate(
          multipleIdFilter,
          {
            $set: { "comments.$.text": newText },
          },
          { new: true }
        );

        return updatedPost;

        // const post = await Post.findById(postId);

        // if (!post) {
        //   console.log("post not found");
        //   return null;
        // }

        // const commentIndex = post.comments.findIndex((comment) =>
        //   comment._id.equals(commentId)
        // );

        // if (commentIndex === -1) {
        //   console.log("Comment not found");
        //   return null;
        // }

        // post.comments[commentIndex].text = newText;
        // const updatedPost = await post.save({ new: true });

        // console.log("Comment Updated Successfully");
        // return updatedPost;

        // return await Post.findByIdAndUpdate(
        //   { _id: postId, "comments._id": commentId },
        //   { $set: { "comments.$.text": newText } },
        //   { new: true }
        // );
      } catch (error) {
        console.log("couldn't edit comment");
        console.log(error);
      }
    },
    addReactionToPost: async (parent, { postId, ...newReaction }, context) => {
      try {
        // console.log("context.user:", context.user);
        // Check if user is logged in
        if (!context.user) {
          throw ErrorMustBeLoggedIn;
        }

        const post = await Post.findById(new ObjectId(postId));
        // console.log("found post:", post);
        const reactions = post.reactions;
        const userId = context.user._id

        // Add the userId to the newReaction object
        newReaction.author = userId;

        // Assume we're adding a new reaction. So, this will push the new reaction to the database
        let update = {
          $push: {
            reactions: newReaction,
          },
        };

        // Check if there are any reactions
        if (reactions.length > 0) {
          // Find if the user has already reacted or not
          const didUserReact = reactions.filter((reaction) =>
            new ObjectId(userId).equals(reaction.author)
          );
          // console.log("did user already react?", didUserReact[0]

          if (didUserReact[0]) {
            // Change the `update` object to remove the user's reaction
            update = {
              $pull: {
                reactions: { author: new ObjectId(userId) },
              },
            };
          }
        }

        // Add reaction to post
        const updatedPost = await Post.findByIdAndUpdate(
          new ObjectId(postId),
          update,
          { new: true }
        );

        // console.log("updatedPost:", updatedPost);
        return updatedPost;
      } catch (error) {
        console.log("Couldn't add reaction to post");
        console.error(error);
      }
    },
    addReactionToComment: async (parent, { postId, commentId, ...newReaction }, context) => {
      try {
        // console.log("context.user:", context.user);
        // Check if user is logged in
        if (!context.user) {
          throw ErrorMustBeLoggedIn
        }

        // set variables to use the postId AND commentId in the query in one go.
        const multipleIdFilter = {
          _id: new ObjectId(postId),
          "comments._id": new ObjectId(commentId),
        };

        const post = await Post.findById(new ObjectId(postId));
        const comments = post.comments;
        const reactions = comments.filter(
          (comment) => comment.id === commentId
        )[0].reactions;

        if (reactions.length > 0) {
          // Find if the user has already reacted or not
          const didUserReact = reactions.filter((reaction) => new ObjectId(context.user._id).equals(reaction.author));

          // console.log("didUserReact:", didUserReact);

          if (didUserReact[0]) {
            // console.log("going to remove reaction")
            // Remove the user's reaction from the comment
            const author = didUserReact[0].author;
            return await Post.findOneAndUpdate(
              multipleIdFilter,
              {
                $pull: {
                  "comments.$.reactions": { author: new ObjectId(author) },
                },
              },
              { new: true }
            )
            .populate('author') // get the post author
            .populate({ // Get the author of the comment
              path: "comments.author",
              select: "userName"
            });
          }
        }

        // Add reaction to comment
        newReaction.author = context.user._id; // Add the user's id to the reaction object
        const updatedPost = await Post.findOneAndUpdate(
          multipleIdFilter,
          {
            $push: { "comments.$.reactions": newReaction },
          },
          { new: true }
        )
        .populate('author') // get the post author
        .populate({ // Get the author of the comment
          path: "comments.author",
          select: "userName"
        });

        return updatedPost;
      } catch (error) {
        console.log("Couldn't add reaction to comment");
        console.error(error);
      }
    },
    editTagsFromPost: async (parent, { postId, newTags }, context) => {
      try {
        // console.log("context.user:", context.user);
        // Check if user is logged in
        // if (!context.user) {
        //   throw ErrorMustBeLoggedIn
        // }

        // Overwrite the array with the new tags
        return await Post.findByIdAndUpdate(
          new ObjectId(postId),
          { $set: { tags: newTags } },
          { new: true }
        );
      } catch (error) {
        console.log("Couldn't add tags to post");
        console.error(error);
      }
    },
  },
};

module.exports = resolvers;
