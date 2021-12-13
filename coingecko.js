var express = require('express');
var app = express();
var fs = require("fs");
var request = require('request');
request('https://api.coingecko.com/api/v3/simple/price?ids=Solana&vs_currencies=usd', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('===========================================================================================');
    var res = JSON.parse(body);
    console.log("Solana price in USD: ", res.solana.usd); // Print the google web page.
    console.log('===========================================================================================');
  }
});
