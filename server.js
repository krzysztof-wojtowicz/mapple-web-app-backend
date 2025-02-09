require("dotenv").config();

const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

// express
const app = express();

// middleware
app.use(express.json({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: ["https://mapple-app.vercel.app"],
    //credentials: true
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/posts/", postRoutes);
app.use("/api/user/", userRoutes);

// connect to db
const options = {
  dbName: process.env.DB_NAME,
};

mongoose
  .connect(process.env.MONGO_URL, options)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
