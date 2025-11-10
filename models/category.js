import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model("category", categorySchema);
