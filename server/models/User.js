const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
// const dateFormat = require('../utils/dateFormat');

const userSchema = new Schema({
  userName: {
    type: String,
    required: "Username is required!",
    trim: true,
    minlength: 6,
    maxlength: 100,
    unique: true,
  },
  email: {
    type: String,
    required: "Please enter a valid email!",
    trim: true,
    validate: {
      validator: (email) => RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(email),
      message: "Email validation failed"
    }
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 20,
    required: "Password is required!",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
}, {
  toJSON: {
    virtuals: true
  },
  id: true,
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

const User = model("User", userSchema);
module.exports = User;
