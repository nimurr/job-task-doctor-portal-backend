const { Doctor, Patient } = require("../models");
const getDashboard = async ({ fromDate, toDate }) => {
  const dateMatch = fromDate || toDate ? { createdAt: { ...(fromDate && { $gte: new Date(fromDate) }), ...(toDate && { $lte: new Date(`${toDate}T23:59:59.999Z`) }) } } : {};
  const [totalDoctors, totalPatients, patientsByStatus, patientsPerDoctor, patientsByDate] = await Promise.all([
    Doctor.countDocuments({ isActive: true }), Patient.countDocuments({ isActive: true }),
    Patient.aggregate([{ $match: { isActive: true } }, { $group: { _id: "$status", total: { $sum: 1 } } }]),
    Patient.aggregate([{ $match: { isActive: true } }, { $group: { _id: "$doctor", total: { $sum: 1 } } }, { $lookup: { from: "doctors", localField: "_id", foreignField: "_id", as: "doctor" } }, { $unwind: "$doctor" }, { $project: { _id: 0, doctorId: "$_id", doctorName: "$doctor.name", specialization: "$doctor.specialization", total: 1 } }, { $sort: { total: -1, doctorName: 1 } }]),
    Patient.aggregate([{ $match: { isActive: true, ...dateMatch } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: 1 } } }, { $project: { _id: 0, date: "$_id", total: 1 } }, { $sort: { date: 1 } }]),
  ]);
  return { totals: { doctors: totalDoctors, patients: totalPatients }, patientsByStatus, patientsPerDoctor, patientsByDate };
};
module.exports = { getDashboard };
