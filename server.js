// require express and path
var express = require("express");
var path = require("path");
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

var messages = [];
var users = {};

var io = require("socket.io").listen(server);
//all code for serverside to be inside the callback passed to io.sockets.o
io.sockets.on("connection", function(socket) {
  console.log(socket.id);

  socket.on("new_user", function(data){
    users[socket.id] = data.user; 
    console.log(data.user);

  io.emit("new_member", {name: data.user});
  socket.emit("all_members", {all_users: users})
})

  socket.on("disconnect", function(data){
    delete users[socket.id];
    socket.broadcast.emit("all_members", {all_users: users})
  })

socket.on("new_message", function(data){

  io.emit("")
})

  // socket.on("new_user", function(data){
  // 	io.emit("alert_peeps", {name: username});
  // })
  // socket.on("new_message", function(message){
  // 	io.emit("display_message", message);
  // })
  // console.log(socket.user);
  //all the socket code goes in here!
  // socket.broadcast.emit("new_user", function(data){
  // 	console.log("new user: " + data.reason);
  // })
})