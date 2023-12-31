const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applause: {
    type: Boolean,
    default: false,
  },
});

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: "please fill out text",
    },
    reactions: [reactionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  }
);

commentSchema.virtual("applauseCount").get(function () {
  return this.reactions.length;
});

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: "Please fill out title",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postText: {
      type: String,
      required: "Please fill out text",
    },
    reactions: [reactionSchema],
    comments: [commentSchema],
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: true,
  }
);

postSchema.virtual("applauseCount").get(function () {
  return this.reactions.length;
});

// Create indexes for Mongo find $text
postSchema.index({
  title: "text",
  postText: "text",
  tags: "text",
});

const Post = model("Post", postSchema);
Post.createIndexes();

module.exports = Post;
