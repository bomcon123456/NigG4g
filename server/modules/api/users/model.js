const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const commentModel = new Schema (
    {
      createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
      content: { type: String, required: true }
    },
    { timestamps: { createdAt: "createdAt" } }
  );
  

const userModel = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, require: true },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return regex.test(value);
                },
                message: "{Value} is not a valid email address!"
            }
        },
        avatar: { type: Buffer },
        gender: { type: String, required: true },
        birthday: { type: Date, required: true },
        active: { type: Boolean, default: true },
        post: { type: Schema.Types.ObjectId, ref: "posts", required: true }
    },
    { timestamps: { createdAt: "createdAt" } }
);

userModel.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    } 

    bcrypt
        .genSalt(12)
        .then(salt => bcrypt.hash(this.password, salt))
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => next(err));
})

module.exports = mongoose.model("users", userModel);
