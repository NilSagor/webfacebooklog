const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  profilepic: {
    type: String,
    default: "https://learncodeonline.in/manicon.png"  
  },
  date: {
    type: Date,
    default: Date.now
  }

})

const Profile = mongoose.model('myProfile', ProfileSchema)

module.exports = Profile