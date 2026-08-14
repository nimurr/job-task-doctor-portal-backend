const httpStatus = require("http-status");
const { Doctor, Patient } = require("../models");
const ApiError = require("../utils/ApiError");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getDoctorById = (id) => Doctor.findById(id);

const createDoctor = async (body) => {
  const exists = await Doctor.exists({ email: body.email.toLowerCase() });
  if (exists) throw new ApiError(httpStatus.BAD_REQUEST, "A doctor with this email already exists");
  return Doctor.create(body);
};

const queryDoctors = async (filters, options) => {
  const query = {};
  if (filters.search) { const pattern = new RegExp(escapeRegex(filters.search), "i"); query.$or = [{ name: pattern }, { specialization: pattern }, { hospital: pattern }, { email: pattern }]; }
  ["specialization", "hospital", "isActive"].forEach((key) => { if (filters[key] !== undefined) query[key] = filters[key]; });
  if (filters.fromDate || filters.toDate) query.createdAt = { ...(filters.fromDate && { $gte: new Date(filters.fromDate) }), ...(filters.toDate && { $lte: new Date(`${filters.toDate}T23:59:59.999Z`) }) };
  return Doctor.paginate(query, options);
};

const updateDoctorById = async (id, body) => {
  const doctor = await getDoctorById(id);
  if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  if (body.email && body.email.toLowerCase() !== doctor.email && await Doctor.exists({ email: body.email.toLowerCase() })) throw new ApiError(httpStatus.BAD_REQUEST, "A doctor with this email already exists");
  Object.assign(doctor, body); await doctor.save(); return doctor;
};
const deleteDoctorById = async (id) => {
  const doctor = await getDoctorById(id);
  if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  const patientCount = await Patient.countDocuments({ doctor: id });
  if (patientCount) throw new ApiError(httpStatus.CONFLICT, "Reassign or delete this doctor's patients before deleting the doctor");
  await doctor.deleteOne(); return doctor;
};

const getDoctorWithPatients = async (id) => {
  const doctor = await getDoctorById(id);
  if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");
  const patients = await Patient.find({ doctor: id, isActive: true }).select("-__v");
  return { doctor, patients };
};

module.exports = { createDoctor, queryDoctors, getDoctorById, updateDoctorById, deleteDoctorById, getDoctorWithPatients };
