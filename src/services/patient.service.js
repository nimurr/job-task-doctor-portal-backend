const httpStatus = require("http-status");
const { Doctor, Patient } = require("../models");
const ApiError = require("../utils/ApiError");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getPatientById = (id) => Patient.findById(id).populate("doctor", "name specialization hospital email phone");
const assertDoctor = async (id) => { if (!await Doctor.exists({ _id: id })) throw new ApiError(httpStatus.BAD_REQUEST, "Assigned doctor does not exist"); };
const createPatient = async (body) => { await assertDoctor(body.doctor); const patient = await Patient.create(body); return getPatientById(patient.id); };
const queryPatients = async (filters, options) => {
  const query = {};
  if (filters.search) { const pattern = new RegExp(escapeRegex(filters.search), "i"); query.$or = [{ name: pattern }, { condition: pattern }, { notes: pattern }]; }
  ["doctor", "status", "condition", "isActive"].forEach((key) => { if (filters[key] !== undefined) query[key] = filters[key]; });
  if (filters.fromDate || filters.toDate) query.createdAt = { ...(filters.fromDate && { $gte: new Date(filters.fromDate) }), ...(filters.toDate && { $lte: new Date(`${filters.toDate}T23:59:59.999Z`) }) };
  return Patient.paginate(query, { ...options, populate: "doctor name specialization hospital email phone" });
};
const updatePatientById = async (id, body) => { const patient = await Patient.findById(id); if (!patient) throw new ApiError(httpStatus.NOT_FOUND, "Patient not found"); if (body.doctor) await assertDoctor(body.doctor); Object.assign(patient, body); await patient.save(); return getPatientById(id); };
const deletePatientById = async (id) => { const patient = await Patient.findById(id); if (!patient) throw new ApiError(httpStatus.NOT_FOUND, "Patient not found"); await patient.deleteOne(); return patient; };
module.exports = { createPatient, queryPatients, getPatientById, updatePatientById, deletePatientById };
