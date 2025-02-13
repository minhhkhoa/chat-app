const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    default: ""
  },
  urlFile: {
    type: String,
    default: ""
  },
  // imageUrl: {
  //   type: String,
  //   default: ""
  // },
  // videoUrl: {
  //   type: String,
  //   default: ""
  // },
  seen: {
    type: Boolean,
    default: false
  },
  msgByUserId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const conversationSchema = new mongoose.Schema({
  sender: { //-ng gửi
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User' //-Dùng để liên kết (populate) với collection User
  },
  receiver: { //- ng nhận
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message'
    }
  ]
}, {
  timestamps: true
})

const MessageModel = mongoose.model('Message', messageSchema, "Messages");
const ConversationModel = mongoose.model('Conversation', conversationSchema, "Conversations");

module.exports = {
  MessageModel,
  ConversationModel
}