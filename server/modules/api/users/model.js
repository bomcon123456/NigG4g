const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userModel = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, require: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
          const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return regex.test(value);
        },
        message: "{Value} is not a valid email address!"
      }
    },
    avatarURL: { type: String, default: "" },
    birthday: { type: Date },
    active: { type: Boolean, default: true },
    social: {
      id: String,
      type: {
        type: String,
        enum: ["GOOGLE", "FACEBOOK"]
      }
    },
    verified: {
      type: Boolean,
      default: false,
      required: true
    },
    posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post"
        }
      ],
      required: false,
      default: []
    }
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
});

module.exports = mongoose.model("User", userModel);
