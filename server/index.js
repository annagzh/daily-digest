var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Subscriber = require('../database-mongo/index.js').subscriber;
var Username = require('../database-mongo/index.js').username;
var async = require('async');

var mailgunApiKey = 'key-e3edd9c95058dd83cac50b50d5ea0e2a';
var mailgunUrl = 'api.mailgun.net/v3/annazharkova.com/messages';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/add', function (req, res) {
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

// ---------------------------------------------------------------------------------
//  get Instagram user id:
// app.get('/userid', function(req, res) {
//   request(`https://api.instagram.com/v1/users/search?q=${annagzh}&access_token=30829209.4585f3e.aaff98d0e8374746ae61468a88c19856`, function(err, response, body) {
//     if (err) {
//       console.error(err);
//       // callback(err);
//     } else {
//       var parsedBody = JSON.parse(body);
//       // console.log(parsedBody.data[0].id);
//       res.json(parsedBody.data[0].id);
//       // callback()
//       // return parsedBody.data[0].id
//     }
//   })
// })

// console.log('getMostRecentPic:', getMostRecentPic('30829209'));
// var usernamesTest = ['trouprouge', 'annagzh']
// var usernamesWithPics = async.each(usernamesTest, getInstagramUserId, function(err) {
//   if( err ) {
//     // One of the iterations produced an error.
//     // All processing will now stop.
//     console.log("Couldn't get Instagram user id");
//   } else {
//     console.log('Got all Instagram user id successfully');
//   }
// })

// console.log(usernamesTest);
//
// getMostRecentPic = function (username) {
//   app.get('/getpic', function(req, res) {
//     request(`https://www.instagram.com/${username}/media/`, function(error, response, body) {
//       if (error) {
//         console.error(error);
//       } else {
//         var parsedBody = JSON.parse(body);
//         res.json(parsedBody.data[0].images.standard_resolution.url);
//         // return parsedBody.data[0].images.standard_resolution.url;
//         // // res.end()
//         // // return result;
//       }
//     })
//   })
// }

// ---------------------------------------------------------------------------
// TESTING ASYNC.MAP:
var usernamesTest = ['troprouge', 'annagzh'];
var getMostRecentPic = function(username, callback) {
  request(`https://www.instagram.com/${username}/media/`, function(error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      if (!body.includes('<!DOCTYPE html>')) {
        var parsedBody = JSON.parse(body);
        return callback(null, parsedBody.items[0].images.standard_resolution.url)
      }
    }
  })
}

async.map(usernamesTest, getMostRecentPic, function(err, results) {
    if( err ) {
    // One of the iterations produced an error.
    // All processing will now stop.
    console.log("Couldn't get Instagram user id");
    console.log('err:', err);
    // return err;
  } else {
    console.log('Got all Instagram pics successfully');
    console.log('results:', results);
  }
  // console.log('results:', results);
})
// console.log(usernamesWithPics);

// -------------------------------------------------------------------
//  WORKING CODE:
var getEmailContent = function(subscriber, callback) {
  Subscriber.findOne({ email: subscriber }, ['usernames'], function (err, usernames) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, usernames.usernames);
    }
  })
}

app.post('/getlist', function(req, res) {
  getEmailContent(req.body.email, function(err, usernames) {
    var clickableUsernames = usernames.map(function (username) {
      return `<p><a href="https://instagram.com/${username}">${username}</a></p>`
    })

    if (err) {
      console.error(err);
    } else {
      var formData = {
        from: 'InstaDigest <instadigest@annazharkova.com>',
        to: req.body.email,
        subject: 'Your list of subscriptions',
        html: "<html><head><title>InstaDigest</title></head><body><p>You're currently receiving posts from these accounts:</p>" + clickableUsernames.join('') + "</body>"
      };
      var options = {
        method: 'POST',
        uri: 'https://api:' + mailgunApiKey + '@' + mailgunUrl,
        qs: formData
      };
      request(options, function (err, httpResponse, body) {
        if (err) {
          console.error(err);
        } else {
          console.log(body);
        }
      })
    }
  })
})

// ------------------------------------------------------------------------------
//
app.get('/show', function(req, res) {
  request('https://api.instagram.com/v1/users/search?q=annagzh&access_token=30829209.4585f3e.aaff98d0e8374746ae61468a88c19856', function(error, response, body) {
    if (error) {
      console.error(error);
    } else {
      var parsedBody = JSON.parse(body);
      // console.log('parsedBody', parsedBody);
      res.json(parsedBody);
    }
  })
})

app.listen(3000, function() {
  console.log('listening on port 3000!');
});


// CLICKABLE USERNAMES IN EMAIL - WORKING CODE:
// app.post('/getlist', function(req, res) {
//   getEmailContent(req.body.email, function(err, usernames) {
//     var clickableUsernames = usernames.map(function (username) {
//       return `<p><a href="https://instagram.com/${username}">${username}</a></p>`
//     })
//     if (err) {
//       console.error(err);
//     } else {
//       var formData = {
//         from: 'InstaDigest <instadigest@annazharkova.com>',
//         to: req.body.email,
//         subject: 'Your list of subscriptions',
//         html: "<html><head><title>InstaDigest</title></head><body><p>You're currently receiving posts from these accounts:</p>" + clickableUsernames.join('') + "</body>"
//       };
//       var options = {
//         method: 'POST',
//         uri: 'https://api:' + mailgunApiKey + '@' + mailgunUrl,
//         qs: formData
//       };
//       request(options, function (err, httpResponse, body) {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(body);
//         }
//       })
//     }
//   })
// })
