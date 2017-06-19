var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Subscriber = require('../database-mongo');
// var Username = require('../database-mongo/index.js');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));

// console.log('db', db);

// app.get('/subscribers', function (req, res) {
//   Subscriber.selectAll(function(err, data) {
//     if (err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

app.post('usernames/import', function (err, res, body) {

 request({}, function (error, response, body) {
   if (error) {
     console.error(error);
   } else {
     var parsedBody = JSON.parse(body);
     console.log('body in request:', typeof parsedBody);
     res.end();
   }
 });
})

// app.get('/usernames', function (req, res) {
//   Username.find({}, function(err, data) {
//     if (err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

app.listen(3000, function() {
  console.log('listening on port 3000!');
});
