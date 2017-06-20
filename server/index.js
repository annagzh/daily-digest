var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Subscriber = require('../database-mongo').subscriber;
var Username = require('../database-mongo/index.js').username;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));


app.post('/add', function (req, res) {
  console.log('req.body in app.post', req.body.username);
  Subscriber.findOneAndUpdate({ email: req.body.email },
    { email: req.body.email, $addToSet: {usernames: req.body.username} },
    { upsert: true, new: true },
    function (err) {
    if (err) {
      console.error(err);
    }
  })
  Username.findOneAndUpdate({ name: req.body.username },
    { name: req.body.username, $addToSet: {subscribers: req.body.email} },
    { upsert: true, new: true },
    function (err) {
    if (err) {
      console.error(err);
    }
  })

})

var mailgunApiKey = 'key-e3edd9c95058dd83cac50b50d5ea0e2a';
var Mailgun = require('mailgun-js');
// var mailgun = require('mailgun-js')({ apiKey: mailgunApiKey, domain: 'https://api.mailgun.net/v3/sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org/messages'})
// app.post('/testemail', function (req, res) {
//   var data = {
//     from: 'Excited User <postmaster@sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org>',
//     to: 'annagzh@gmail.com',
//     subject: 'Hello from Daily Digest',
//     text: 'hi!'
//   }
//
//   mailgun.messages().send(data, function (err, body) {
//     console.log('body in mailgun send: ', body);
//   })
  // request.post('https://api.mailgun.net/v3/sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org/messages', {
  //   'auth': {
  //     'api': mailgunApiKey
  //   },
  //   'data' : {
  //     'from': '<postmaster@sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org>',
  //     'to': 'annagzh@gmail.com',
  //      'subject':'Hello from Daily Digest',
  //      'text': 'hi!'
  //   }
  // })
// })
app.get('/testemail', function(req, res) {
  var mailgun = new Mailgun({apiKey: mailgunApiKey, domain: 'https://api.mailgun.net/v3/sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org/messages'});

  var data = {
    from: 'postmaster@sandbox2ae20a0e34d147ed887ce38a536d2c58.mailgun.org',
    to: 'annagzh@gmail.com',
    subject: 'Hello from Daily Digest',
    text: 'hi!'
  }

  mailgun.messages().send(data, function (err, body) {
      //If there is an error, render the error page
      if (err) {
        console.error("got an error: ", err);
      } else {
        console.log(body);
      }
  });

});

var getEmailContent = function(subscriber) {
  Subscriber.findOne({ email: subscriber }, 'usernames', function (err, usernam) {
    if (err) {
      console.error(err);
    } else {
      return 
    }
}

Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
  if (err) return handleError(err);
  console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
})


app.get('/show', function(req, res) {
  request('https://api.instagram.com/v1/users/30829209/media/recent/?access_token=30829209.4585f3e.aaff98d0e8374746ae61468a88c19856', function(error, response, body) {
    if (error) {
      console.error(error);
    } else {
      var parsedBody = JSON.parse(body);
      res.json(parsedBody);
    }
  })
})


// app.get('/subscribers', function (req, res) {
//   Subscriber.selectAll(function(err, data) {
//     if (err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });


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
