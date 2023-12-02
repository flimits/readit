const { Schema, model } = require('mongoose');
// const dateFormat = require('../utils/dateFormat');

const userSchema = new Schema ({
    userName: {
        type: String,
        required: "Username is required !",
        trim: true,
        maxlength: 100,
        minlenght: 6,
        unique: true,
    },
    email: {
        type: String,
        required: "Please enter a valid email !",
        trim: true,
        maxlength: 100,
        minlenght: 6,
    },
    password: {
        type: String, //TODO check type!!
        minlength: 6,
        maxlength: 20,
        required: "Password is required!"
    },
    // posts: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Post',
    //       },
    // ]
});

const User = model('User', userSchema);
module.exports = User;