const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  content: String,
  streak_start: Date,
  updated_last: Date,
  id: String,
});

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Task", taskSchema);
