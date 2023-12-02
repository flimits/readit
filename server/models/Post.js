const { Schema, model } = require("mongoose");
const { ObjectId } = require("bson");

const commentSchema = new Schema({
  commentId: {
    type: Schema.Types.ObjectId,
    default: new ObjectId(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: "please fill out text",
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: "Reactions" }],
});

const postSchema = new Schema({
  title: {
    type: String,
    required: "Please fill out title",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postText: {
    type: String,
    required: "Please fill out text",
  },
  reactions: [{ type: Schema.Types.ObjectId, ref: "Reactions" }],
  comments: [commentSchema],
  tags: [{ type: String }],
});

const Post = model("Post", postSchema);
module.exports = Post;
