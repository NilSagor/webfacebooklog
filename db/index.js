const mongoose = require('mongoose')
mongoose
  .connect('mongodb://localhost:27017/webfacebooklog', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log("mongo is connected"))
  .catch(err => console.log(err))
// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
const Person = require('./Person')
const Profile = require('./Profile')
module.exports = {
  Person,
  Profile
}