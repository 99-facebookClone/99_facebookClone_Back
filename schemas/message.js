const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room_id: {
    type: String,
    require: true,
  },
  message_from: {
    type: String,
    require: true,
  },
  message_to: {
    type: String,
    require: true,
  },
  content: {
    type: Text,
    require: true,
  },
});

messageSchema.set("timestamps", { createdAt: true, updatedAt: true });

module.exports = mongoose.model("Message", messageSchema);
