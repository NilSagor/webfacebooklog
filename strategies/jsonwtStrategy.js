const mongoose = require('mongoose')
const Person = mongoose.model("myPerson")

const myKey = require('../setup/myurl')


var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = myKey.secret;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Person.findById({id: jwt_payload.id})
      .then(person => {
        if (person) {
          return done(null, person)
        }
        return done(null, false)
      })
      .catch(err => console.log(err)) 
        
  }))
}
