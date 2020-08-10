const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const passport = require('passport')
const jsonwt = require('jsonwebtoken')
const key = require('../../setup/myurl')

const { Person, Profile } = require('../../db')
// const Person = require('../../db/Person')

// @type GET
// @route /api/v1/profile
// @desc route for user profile after login
// @access PRIVATE 

router.get("/",
  passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          if (!profile) {
            return res
                  .status(404)
                  .json({profileNotFound: "No profile found"})
          }
          res.json(profile);
        })
        .catch(err=> console.log("got some error in profile " + err))
  })

// @type POST
// @route /api/v1/profile
// @desc route for user profile after login
// @access PRIVATE 
router.post('/', passport.authenticate('jwt', {session:false}),
    (req, res) => {
      const profileValues = {}
      profileValues.user = req.user.id
      if (req.body.username) profileValues.username == req.body.username
      if (req.body.website) profileValues.website == req.body.website
      if (req.body.country) profileValues.country == req.body.country
      if (req.body.portfolio) profileValues.portfolio == req.body.portfolio
      if (typeof req.body.languages != undefined) profileValues.languages = req.body.languages.split(",")
      profileValues.social = {}
      if (req.body.youtube) profileValues.social.youtube == req.body.youtube
      if (req.body.facebook) profileValues.social.facebook == req.body.facebook
      if (req.body.instagram) profileValues.social.instagram == req.body.instagram
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          if (profile) {
            Profile.findOneAndUpdate(
              { user: req.user.id },
              {$set: profileValues},
              {new: true}
            )
            .then(profile => res.json(profile))
            .catch(err => console.log("Problem is updated" + err))
          } else {
            Profile.findOne({ username: profileValues.username })
              .then(profile => {
                if (profile) {
                  res.status(404).json({usernameError:"username already exists"})
                }
                new Profile(profileValues)
                  .save()
                  .then(profile => res.json(profile))
                  .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          }
        })
      }
    )

// @type GET
// @route /api/v1/profile/:username
// @desc route for getting user profile based on username
// @access PUBLIC
router.get('/:username', (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilepic"])    
    .then(profile => {
      if (!profile) {
        res.status(404).json({usernameNotFound: "User not found"})
        return
      }
      res.json(profile)
    })
    .catch(err => console.log("Error in fetching username" + err))
})

// @type GET
// @route /api/v1/profile/:username
// @desc route for getting user profile based on username
// @access PUBLIC
router.get('/find/everyone', (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({userNotFound: "No User was found"})
      }
      res.json(profiles)
    })
    .catch(err => console.log("Error in fetching username" + err))
})

// @type DELETE
// @route /api/v1/profile/
// @desc route for deleting user profile 
// @access PRIVATE

router.delete('/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({_id:req.user.id})
        .then(() => res.json({ success: "delete was successful" }))
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err)) 

})

// @type POST
// @route /api/v1/profile/mywork
// @desc route for adding work profile of a person
// @access PRIVATE

router.post('/mywork', 
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newWork = {
        role: req.body.role,
        country: req.body.country,
        country: req.body.country,
        company: req.body.company,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        details: req.body.details
      }
      profile.workrole.push(newWork)
      Prorile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err))
    })
  }
)

// @type POST
// @route /api/v1/profile/mywork
// @desc route for adding work profile of a person
// @access PRIVATE




  module.exports = router 