var redis = require('redis'); 
var express = require('express'); 
var nowjs = require('now'); 
var RedisStore = require('connect-redis')(express); 
var client = redis.createClient(); 
var app = express.createServer(
  express.cookieParser(),
  express.session({secret:'asdf', store: new RedisStore})
); 
var everyone = nowjs.initialize(app); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'jade'); 
app.configure(function(){ 
        app.use(express.static(__dirname + '/public')); 
    app.use(express.cookieParser());
    app.use(express.bodyParser()); 
    app.use(app.router); 
    app.use(express.session({ store: new RedisStore, secret: 'keyboard cat' })); 
}); 

app.get('/room/:id', function(req, res) { 
        console.log("**************"); 
        console.log("room: "+req.params.id); 
        console.log("**************"); 
        req.session.roomId = req.params.id; 
        res.render('room', { pageTitle: 'Testando Jade', roomId: 
req.params.id}); 
}); 

app.listen(3000); 
everyone.now.showHistory = function() { 
everyone.now.fillMessages(client.get('messages'+everyone.now.roomId)); 
}; 

everyone.now.send = function(message) { 
        client.rpush('messages'+everyone.now.roomId, message); 
        everyone.now.receive(message); 
} 
