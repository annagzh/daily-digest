var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Subscriber = require('../database-mongo').subscriber;
var Username = require('../database-mongo/index.js').username;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/add', function (req, res) {
  console.log('req.body in app.post', req.body.username);
  Subscriber.create({ email: req.body.email, usernames: [req.body.username]}, function (err) {
    if (err) {
      console.error(err);
    }
  })
  Username.create({ name: req.body.username, subscribers: [req.body.email]}, function (err) {
    if (err) {
      console.error(err);
    }
  })

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

// app.post('/movies/new', function (req, res) {
//   Movie.create(req.body, function (err) {
//     if (err) {
//       console.error(err);
//     }
//   })
// })

// app.post('/repos/import', function (req, res) {
//   var options = {
//     url: `https://api.github.com/users/${req.body.githubUsername}/repos`,
//     headers: {
//       'User-Agent': 'annagzh'
//     }
//   };
//   request(options, function (error, response, body) {
//     if (error) {
//       console.error(error);
//     } else {
//       var parsedBody = JSON.parse(body);
//       console.log('body in request:', typeof parsedBody);
//       for (var i = 0; i < parsedBody.length; i++) {
//         Repo.findOneAndUpdate({ id: parsedBody[i].id }, {
//           id: parsedBody[i].id,
//           name: parsedBody[i].name,
//           html_url: parsedBody[i].html_url,
//           size: parsedBody[i].size,
//           user: parsedBody[i].owner.login
//         }, { upsert: true, new: true }, function(err, repo) {
//           if (err) {
//             console.error(err);
//           } else {
//             console.log('repo in findOneAndUpdate: ', repo);
//           }
//         });
//         res.end();
//       }
//     }
//   });
// });
