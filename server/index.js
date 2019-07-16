require("dotenv").config({ path: "./env/dev.env" });

const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const authRoutes = require("./modules/api/auth/router");
const userRoutes = require("./modules/api/users/router");
const postRoutes = require("./modules/api/posts/router");
const categoryRoutes = require("./modules/api/category/router");
const utilRoutes = require("./modules/api/util/router");

const {
  fileFilter,
  fileStorage
} = require("./modules/common/util/multer-util");

const app = express();

app.use(bodyParser.json());

// Static folder Middleware
app.use("/images", express.static(path.join(__dirname, "/uploads/images")));
app.use("/assets", express.static(path.join(__dirname, "/uploads/assets")));

// CORS-Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Multer (file upload) middleware
app.use(
  "/api",
  multer({
    fileFilter: fileFilter
  }).single("file")
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/util", utilRoutes);

// Error-handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    const port = process.env.PORT;
    console.warn("Listening at port:", port);
    // app.listen(process.env.PORT);
    https
      .createServer(
        {
          key: fs.readFileSync(
            `./modules/common/keys/${process.env.NODE_ENV}/${
              process.env.SSL_KEY_NAME
            }`
          ),
          cert: fs.readFileSync(
            `./modules/common/keys/${process.env.NODE_ENV}/${
              process.env.SSL_CRT_NAME
            }`
          )
        },
        app
      )
      .listen(port);
  })
  .catch(err => console.log(err));
