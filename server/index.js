const express = require('express')
const app = express()
const port = 5000
var bodyParser = require('body-parser')
const passport = require('passport')


const routes = require('./api')

app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize())
require('../strategies/jsonwtStrategy')(passport)

app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})