const mongoose = require("mongoose");

const ChatRoomModel = mongoose.model("chatroom", {
  chatroom_id: String,
  roomName: String, 
  created_at: Date,
  created_by: String,
  updated_at: Date,
  updated_by: String,
  deleted_at: Date,
  deleted_by: String, 
  version: Number,
},'chatroom');

module.exports = ChatRoomModel;

