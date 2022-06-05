const express = require('express')
const { blog, user } = require('fontawesome')
const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')

const verify = require('./verifyToken')
dotenv.config()

const app = express()
const port = 5000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
// app.use(cookieParser())

const db = monk('localhost/BlogDB')
const users = (db.get('users'))

// const oneHour = 1000 * 60 * 60;

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: oneHour
//   },
//   resave: false
// }))

app.get('/', (req, res) => {
  res.render('signupP')
})

app.post('/', (req, res) => {
  const { email, username, password, confirmPassword } = req.body
  if (password === confirmPassword) {
    users.findOne({email: email})
    .then((doc) => {
      if(doc) {
        console.log("There's already a user");
      } else {
        const hash = bcrypt.hashSync(password, 10);
        const user = {
          email, 
          username,
          password: hash
        }
        users.insert(user)
        .then((allusers) => {
          console.log(allusers);
        })
        res.redirect('/signin')
      }
    })
    
  } else {
    console.log("passwords didn't match");
    res.redirect('/')
  }
})

app.get('/signin',(req, res) => {
  res.render('signinP')
})

app.post('/signin', (req, res) => {

  const {email, password} = req.body;

  users.findOne({email: email})
  .then((doc) => {
    if(doc) {
      const tempem = doc.password;
      if(bcrypt.compareSync(password, tempem)) {
        const token = jwt.sign({
          email: email,
          password: password
        }, process.env.SECRET_KEY);
        console.log("Token ", token);
        res.header("auth_token", token)
        res.redirect('/homepage')
        
      } else {
        res.send("Password didn't match")
      }
    }
  })
})



app.get('/homepage', verify, (req, res) => {
  res.render('body')
})

app.post('/homepage', (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
