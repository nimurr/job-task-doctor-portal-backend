const mongoose = require("mongoose");
const validator = require("validator");
const { toJSON, paginate } = require("./plugins");

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    specialization: { type: String, required: true, trim: true, maxlength: 120 },
    hospital: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) throw new Error("Invalid doctor email");
      },
    },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.index({ name: 1, specialization: 1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });
doctorSchema.plugin(toJSON);
doctorSchema.plugin(paginate);

module.exports = mongoose.model("Doctor", doctorSchema);
