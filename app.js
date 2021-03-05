const express = require('express')
const helpers = require('./_helpers');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes/index')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000
//----------------socket.io-----------------
const http = require('http')
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer)
//----------------socket.io-----------------

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

//TEST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))


passport(app)
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(routes)

//----------------socket.io-----------------

io.on('connection', function(socket){
  //console.log(socket)
  
  console.log('a user connected', socket.id); 
  
  socket.on('disconnect', () => {      
    console.log('gone')
  })
  
});

//----------------socket.io-----------------

httpServer.listen(port, () => console.log(`httpServer is running on port ${port}!`))

module.exports = app
