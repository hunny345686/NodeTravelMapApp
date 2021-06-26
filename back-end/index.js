const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

// dotenv file have to config
dotenv.config();

// want to parse data into json neet to write
// globle middelware
app.use(express.json());

// db connections
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect database");
  })
  .catch((err) => {
    console.log(err);
  });

//routes middelware

app.use("/pins", pinRoute);
app.use(userRoute);

// listen on server
app.listen(8000, () => {
  console.log("listening to port 8000");
});
