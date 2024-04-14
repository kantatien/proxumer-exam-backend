const mongoose = require("mongoose");

const MessageModel = mongoose.model("message", {
  id: String,
  body: String, 
  roomName: String,
  image_url: String,
  from: JSON,
  created_at: Date,
  created_by: String,
  updated_at: Date,
  updated_by: String,
  deleted_at: Date,
  deleted_by: String, 
  version: Number,
},'message');

module.exports = MessageModel;

