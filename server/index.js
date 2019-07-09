const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const MONGODB_URI = "mongodb+srv://test:test@cloud-ejl26.mongodb.net/nigg4g";

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

// Multer (file upload) middleware
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter
  }).single("image")
);

// Static folder Middleware
app.use("/images", express.static(path.join(__dirname, "/uploads/images")));

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
  .connect(MONGODB_URI)
  .then(result => {
    const port = process.env.PORT || 6969;
    console.warn("Listening at port:", port);
    app.listen(port);
  })
  .catch(err => console.log(err));
