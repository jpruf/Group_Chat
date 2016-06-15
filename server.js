var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname + "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
 res.render("index");
})
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

    io.emit("new_member_alert", {name: data.user});
    io.emit("all_members", {all_users: users})
  })

  socket.on("disconnect", function(data){
    console.log(users[socket.id]);
    io.emit("disconnect_alert", {name: users[socket.id]});
    delete users[socket.id];
    socket.broadcast.emit("all_members", {all_users: users})
  })

  socket.on("new_message", function(data){
    console.log(data.message);
    io.emit("display_message", {message: data.message, user: users[socket.id]});
  })
})