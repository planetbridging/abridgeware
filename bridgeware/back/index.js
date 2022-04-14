const http = require("http");
const https = require("https");
var express = require("express");
var cors = require("cors");
var uuid = require("uuid"),
  app = express(),
  server = require("http").createServer(app);
const axios = require("axios").default;

const { encrypt, decrypt } = require("./helpers/crypto");

(async () => {
  console.log("welcome to the bridgeware");
  var tk = uuid.v4();

  var secretKey = tk;

  var txt_test = encrypt(secretKey, "Hello from socket shannon");
  console.log(txt_test);
})();
