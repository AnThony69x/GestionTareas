const mongoose = require("mongoose");
// Modelo de Tarea
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["pendiente","en_proceso", "completada"], default: "pendiente" },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
