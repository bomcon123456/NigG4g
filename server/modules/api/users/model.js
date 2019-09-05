const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userModel = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
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
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "UNSPECIFIED", "NULL"],
      default: "NULL"
    },
    homeCountry: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      default: "5d328ca0fa6aa2366918c496"
    },
    maskNSFW: {
      type: Boolean,
      default: false,
      required: true
    },
    showNSFW: {
      type: Boolean,
      default: true,
      required: true
    },
    isPro: {
      type: Boolean,
      required: true,
      default: false
    },
    statusId: {
      type: Schema.Types.ObjectId,
      ref: "Status",
      default: "5d368a0cfcb82a10b27d53d8"
    },
    description: {
      type: String,
      default: ""
    },
    avatarURL: {
      type: String,
      default: `${process.env.ASSET_DIR}/1_62_100_v0.jpg`
    },
    birthday: { type: Date },
    active: { type: Boolean, default: true },
    social: {
      type: [
        {
          id: String,
          type: {
            type: String,
            enum: ["GOOGLE", "FACEBOOK"]
          }
        }
      ],
      default: []
    },
    verified: {
      type: Boolean,
      default: false,
      required: true
    },
    posts: {
      type: [
        {
          type: String,
          ref: "Post"
        }
      ],
      required: false,
      default: []
    },
    upVotes: {
      type: [
        {
          type: String,
          ref: "Post"
        }
      ],
      required: false,
      default: []
    },
    downVotes: {
      type: [
        {
          type: String,
          ref: "Post"
        }
      ],
      required: false,
      default: []
    },
    favorite: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category"
        }
      ],
      require: false,
      default: []
    },
    notifications: {
      type: [
        {
          type: {
            type: String,
            enum: [
              "UPVOTED",
              "MENTIONED",
              "COMMENTED",
              "MILESTONE10",
              "MILESTONE50",
              "MILESTONE100"
            ]
          },
          createBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          createdAt: {
            type: Date,
            default: Date.now()
          },
          seen: {
            type: Boolean,
            default: false
          },
          redirect: {
            type: String,
            required: true
          }
        }
      ],
      default: [],
      required: true
    },
    isChangePassword: {
      type: Boolean,
      default: false,
      required: true
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
