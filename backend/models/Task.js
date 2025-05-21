const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["pendiente", "completada"], default: "pendiente" },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
