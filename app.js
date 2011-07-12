/**
 * Module dependencies.
 */

var express = require('express');
var ejs = require('ejs');
var RedisStore = require('connect-redis')(express);
var store = new RedisStore;

var app = module.exports = express.createServer(
  express.cookieParser(),
  // express.session({secret:'asdf', store: new RedisStore})
  express.session({secret:'asdf'})
);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  },
  
  flash: function(req, res){
    return req.flash();
  }
});
// Route middleware
function requiresLogin(req, res, next){
  console.log(req.session);
  if (req.session.user){
    next();
  } else{
    res.redirect('/sessions/new?redir=' + req.url);
  }  
}

/* Sessions */
app.get('/sessions/new', function(req, res){
  res.render('sessions/new', {locals: {
      redir: req.query.redir, title: 'Login!', layout:false
    }});
});

var users = require('./users');

app.post('/sessions', function(req, res){
  users.authenticate(req.body.login, req.body.password, function(user){
    if (user) {
      req.session.user = user;
      res.redirect(req.body.redir);
    } else {
      req.flash('warn', 'Login failed');
      res.render('sessions/new', {locals:{
      redir: req.bod.redir}
      });
    }
  });
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express', layout:true
  });
});

app.get('/login', requiresLogin, function(req, res){
  res.render('login', {
  title: 'Teamory Login!', layout: true
  });
});

app.get('/profile', requiresLogin, function(req, res){
  res.render('profile', {
  title: 'Teamory Login!',
  date: new Date().toDateString(),
  n: 5,
  layout: true
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(8081);
  console.log("Express server listening on port %d", app.address().port);
}
