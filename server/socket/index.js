const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/User.model');
const { ConversationModel, MessageModel } = require('../models/Conversation.model');
const getConversation = require('../helpers/getConversation');

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
  socket.join(user?._id.toString());
  // console.log("rooms: ", socket.rooms)
  onlineUser.add(user?._id?.toString()); //- them vao

  io.emit('onlineUser', Array.from(onlineUser)); //- gui nhung dua online

  socket.on('message-page', async (userId) => {
    console.log("userId: ", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId)
    }
    socket.emit('message-user', payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id }
      ]
    }).populate('messages').sort({ updatedAt: -1 });

    socket.emit('message', getConversationMessage?.messages || []);
  })

  //-new message
  socket.on('new message', async (data) => {

    // Kiểm tra xem cuộc trò chuyện giữa hai người đã tồn tại hay chưa
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    })

    //-Nếu chưa có cuộc trò chuyện, tạo mới
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver
      });
      conversation = await createConversation.save();
    }


    const message = new MessageModel({
      text: data.text,
      urlFile: data.urlFile,
      msgByUserId: data?.msgByUserId,
    })
    const saveMessage = await message.save();


    const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
      "$push": { messages: saveMessage?._id }
    });

    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender }
      ]
    }).populate('messages').sort({ updatedAt: -1 });


    // io.emit('message', getConversationMessage?.messages || []);
    io.to(data?.sender).emit('message', getConversationMessage?.messages || []);
    io.to(data?.receiver).emit('message', getConversationMessage?.messages || []);

    // //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit('conversation', conversationSender);
    io.to(data?.receiver).emit('conversation', conversationReceiver);
  });

  //sidebar
  socket.on('sidebar', async (currentUserId) => {
    console.log("current user", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit('conversation', conversation);

  });

  socket.on('seen', async (msgByUserId) => {

    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id }
      ]
    });

    const conversationMessageId = conversation?.messages || []

    const updateMessages = await MessageModel.updateMany(
      { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
      { "$set": { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit('conversation', conversationSender);
    io.to(msgByUserId).emit('conversation', conversationReceiver);
  })

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