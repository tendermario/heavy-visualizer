require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
const PORT = process.env.SERVER_PORT || 8888;

//// Routes

// This is for the uploader
// const musicApi = require('./routes/music');

//// Server

const app = express();
app.set("view engine", "ejs");
// Tells app to use the public as the static file location
app.use(express.static('public'))
   .use(cookieParser());
//// Middleware

app.use(bodyParser.urlencoded({ extended: true }));

//// Routes

app.get("/", (req, res) => {
  res.render("index");
});

// Start Server
app.listen(PORT, () => {
  console.log(`VIS app listening on port ${PORT}`);
} );