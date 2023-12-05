const { Schema, model } = require("mongoose");
const { ObjectId } = require("bson");

const reactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applause: {
    type: Boolean,
    default: false,
  }
});

const commentSchema = new Schema({
  // commentId: {
  //   type: Schema.Types.ObjectId,
  //   default: new ObjectId(),
  // },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: "please fill out text",
  },
  reactions: [reactionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  id: true,
});

commentSchema
  .virtual('applauseCount')
  .get(function () {
    return this.reactions.length;
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
  reactions: [reactionSchema],
  comments: [commentSchema],
  tags: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  id: true,

});


postSchema
  .virtual('applauseCount')
  .get(function () {
    return this.reactions.length;
  });

const Post = model("Post", postSchema);
module.exports = Post;
