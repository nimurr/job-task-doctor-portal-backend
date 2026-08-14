const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const patientSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, required: true, min: 0, max: 130 },
    gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], default: "prefer-not-to-say" },
    condition: { type: String, required: true, trim: true, maxlength: 240 },
    status: { type: String, enum: ["stable", "critical", "recovering"], default: "stable" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    appointmentAt: { type: Date, default: null },
    notes: { type: String, trim: true, maxlength: 3000, default: null },
    image: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ status: 1, appointmentAt: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.plugin(toJSON);
patientSchema.plugin(paginate);

module.exports = mongoose.model("Patient", patientSchema);
