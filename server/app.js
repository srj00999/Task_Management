const express = require("express");
const app = express();
const tasks = require("../server/routes/tasks");
const cors = require("cors");
const connectDB = require("./db/connect");
require("dotenv").config();
const notFound = require("./Middleware/not-found");

app.use(cors());
app.use(express.static("./public"));
app.use(express.json());

app.use("/tasks", tasks);
app.use(notFound);

const startDbAndServer = async () => {
  try {
    await connectDB("mongodb://0.0.0.0:27017/");
    app.listen(3001, () => {
      console.log("Server stared on 3001");
    });
  } catch (error) {
    console.log(error);
  }
};

startDbAndServer();
