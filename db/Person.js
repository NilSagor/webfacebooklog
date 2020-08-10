const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonSchema = new Schema({
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
    type: String  
  },
  date: {
    type: Date,
    default: Date.now
  }

})

const Person = mongoose.model('myPerson', PersonSchema)

module.exports = Person