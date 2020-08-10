const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')
const jsonwt = require('jsonwebtoken')
const key = require('../../setup/myurl')

const { Person } = require('../../db')

router.get("/", (req, res) => {
  res.json({ test: "Auth is successful"})
})

// @type post
// @route /api/v1/register
// @desc route for user registration
// @access PUBLIC

router.post('/register',
  (req, res) => {
    Person.findOne({ email: req.body.email })
      .then(person => {
        if (person) {
          return res
            .status(400)
            .json({ emailError: 'User is already register'})
        } else {
          const newPerson = new Person({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          console.log(newPerson.name)
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newPerson.password, salt, function(err, hash) {
              if (err) throw err
              newPerson.password = hash
              newPerson
                .save()
                .then(person => res.json(person))
                .catch(err => console.log(err))
              })
          })
        }        
      })
      .catch(err => console.log(err))
  })

 // @type post
// @route /api/v1/login
// @desc route for user login
// @access PUBLIC 

router.post('/login',
  (req, res) => {
    const email = req.body.email
    const password = req.body.password
    Person.findOne({ email})
      .then(person => {
        if (!person) {
          return res
                  .status(404)
                  .json({ emailError: 'User not found' })
        }
        bcrypt
          .compare(password, person.password)
          .then(isCorrect => {
            if (isCorrect) {
              const payload = {
                id: person.id,
                name: person.name,
                email: person.email
              } 
              jsonwt.sign(
                payload,
                key.secret,
                {expiresIn:360000},
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  })
                }                         
              )
              // res.json({ success: 'user is able to login successfully' })
          } else {
            res.status(404).json({ password: 'password is not correct'})
          }
        })
          .catch(err => console.log(err))       
        })
      .catch(err => console.log(err)) 
    })

// @type GET
// @route /api/v1/profile
// @desc route for user profile after login
// @access PRIVATE 

router.get('/profile',
  passport.authenticate('jwt', { session: false }), 
    (req, res) => { 
      console.log(req.user.name)   
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        profilepic: req.user.profilepic
      })
  })

module.exports = router 