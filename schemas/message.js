const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room_id: {
    type: String,
    require: true,
  },
  from: {
    type: String,
    require: true,
  },
  to: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});

messageSchema.set("timestamps", { createdAt: true, updatedAt: true });

module.exports = mongoose.model("Message", messageSchema);