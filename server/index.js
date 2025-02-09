const express = require("express");
const cors = require('cors');
require('dotenv').config();

const dataBase = require("./config/database");
dataBase.connect();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "Success connect"
  })
})

app.listen(PORT, () => {
  console.log("server running at " + PORT);
})