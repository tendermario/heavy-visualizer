require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const PORT = process.env.SERVER_PORT || 8888;

//// Server

const app = express();
app.set("view engine", "ejs");
// Tells app to use the public as the static file location
app.use(express.static('public'));

//// Middleware

app.use(bodyParser.urlencoded({ extended: true }));

//// Routes

app.get("/", (req, res) => {
  res.render("index");
});

// Start Server
app.listen(PORT, () => {
  console.log(`ordr app listening on port ${PORT}`);
} );