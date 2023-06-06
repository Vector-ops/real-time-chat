const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();

const PORT = 3000 || process.env.PORT;

//static modules
app.use(express.static(path.join(__dirname, "./public")));

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}... `);
  });
};

startServer();
