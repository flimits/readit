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
    minlength: 6,
    maxlength: 100,
    validate: {
      validator: (email) => RegExp(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).test(email),
      message: "Email validation failed"
    }
  },
  password: {
    type: String, //TODO check type!!
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
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

const User = model("User", userSchema);
module.exports = User;
