const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://test:test@cloud-ejl26.mongodb.net/nigg4g";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    const port = process.env.PORT || 6969;
    console.warn("Listening at port:", port);
    app.listen(port);
  })
  .catch(err => console.log(err));
