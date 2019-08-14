const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.json());

const serverRoot = "/karlysays"
const local = false;

genUrl = (url) => local ? url : `${serverRoot.trim()}${url.trim()}`.trim();

console.log(path.join(__dirname, "build"))
console.log(genUrl("/"))
app.use(genUrl("/"), express.static(path.join(__dirname, "build"), ));

app.get(genUrl("/ping"), function(req, res) {
  return res.send("pong");
});

app.post(genUrl("/new"), (req, res) => {
  if (req.body.quote) {
    let fileQuotes = JSON.parse(fs.readFileSync("./quotes.json"));
    fileQuotes.push(req.body.quote);
    fs.writeFileSync("./quotes.json", JSON.stringify(fileQuotes, null, 2));
    res.send({ status: "success" });
    return;
  }
  res.send({ status: "failure", message: "Must supply quote" });
});

app.post(genUrl("/update"), (req, res) => {
  if (req.body.index !== undefined && req.body.newQuote) {
    let fileQuotes = JSON.parse(fs.readFileSync("./quotes.json"));
    fileQuotes[req.body.index] = req.body.newQuote;
    fs.writeFileSync("./quotes.json", JSON.stringify(fileQuotes, null, 2));
    res.send({ status: "success" });
    return;
  }
  res.send({ status: "failure", message: "Must supply quote and replacement" });
});

app.post(genUrl("/delete"), (req, res) => {
  if (req.body.index !== undefined) {
    let fileQuotes = JSON.parse(fs.readFileSync("./quotes.json"));
    fileQuotes.splice(req.body.index, 1);
    fs.writeFileSync("./quotes.json", JSON.stringify(fileQuotes, null, 2));
    res.send({ status: "success" });
    return;
  }
  res.send({ status: "failure", message: "Must supply quote" });
});

app.get(genUrl("/quotes"), (req, res) => {
  res.send(fs.readFileSync("./quotes.json"));
});

app.get(genUrl("/"), function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get(genUrl("/quotezone"), function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8069
app.listen(PORT, () => console.log("Listening on port " + PORT + " ..."));
