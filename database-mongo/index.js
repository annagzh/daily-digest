var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/subscriber');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var subscriberSchema = mongoose.Schema({
  email: String,
  usernames: [{ type: String, ref: 'Username' }]
});

var usernameSchema = mongoose.Schema({
  name: String,
  subscribers: [{ type: String, ref: 'Subscriber' }]
})

var Subscriber = mongoose.model('Subscriber', subscriberSchema);
var Username = mongoose.model('Username', usernameSchema)

var selectAll = function(callback) {
  Subscriber.find({}, function(err, subscribers) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, subscribers);
    }
  });
};

module.exports.subscriber = Subscriber;
module.exports.username = Username;
module.exports.selectAll = selectAll;

// Subscriber.create({ email: 'annagzh@gmail.com', usernames: ['troprouge'] }, function (err, small) {
//   if (err) {
//     console.error(err);
//   }
// })

// Subscriber.findOne({ email: 'annagzh@gmail.com' }).populate('usernames')
// .exec(function (err, subscriber) {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //
  //     }
  //   });
