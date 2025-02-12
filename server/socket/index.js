const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');

const app = express();

//- socket connect
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

//- online user
const onlineUser = new Set(); //- để bên ngoài chứ để bên trong  mỗi lần nó reset

io.on('connection', async (socket) => {
  console.log("connect user: ", socket.id);

  //-lay ra token gui o ben home
  const token = socket.handshake.auth.token;

  //- current user detail
  const user = await getUserDetailsFromToken(token);

  //- create room
  socket.join(user?._id);
  onlineUser.add(user?._id?.toString()); //- them vao

  io.emit('onlineUser', Array.from(onlineUser)); //- gui nhung dua online

  //-disconnect
  socket.on('disconnect', () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user: ", socket.id);
  });
});

module.exports = {
  app,
  server
}