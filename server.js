// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// static content 
app.use(express.static(path.join(__dirname + "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("group chat on port 8000");
})
var io = require("socket.io").listen(server);
//all code for serverside to be inside the callback passed to io.sockets.o
io.sockets.on("connection", function(socket) {
  console.log(socket.id);

  socket.on("new_user", function(username){
  	console.log(username.user.selector);
  	io.emit("alert_peeps", username.user.selector);
  })
  socket.on("new_message", function(message){
  	console.log(message);
  	io.emit("display_message", message);
  })
  // console.log(socket.user);
  //all the socket code goes in here!
  // socket.broadcast.emit("new_user", function(data){
  // 	console.log("new user: " + data.reason);
  // })
})