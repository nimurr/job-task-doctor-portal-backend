const Joi = require("joi");
const { objectId } = require("./custom.validation");
const status = Joi.string().valid("stable", "critical", "recovering");
const createPatient = { body: Joi.object({ name: Joi.string().trim().max(120).required(), age: Joi.number().integer().min(0).max(130).required(), gender: Joi.string().valid("male", "female", "other", "prefer-not-to-say"), condition: Joi.string().trim().max(240).required(), status, doctor: Joi.string().custom(objectId).required(), appointmentAt: Joi.date().iso().allow(null), notes: Joi.string().allow("", null).max(3000), isActive: Joi.boolean() }) };
const getPatients = { query: Joi.object({ search: Joi.string().allow(""), doctor: Joi.string().custom(objectId), status, condition: Joi.string(), isActive: Joi.boolean(), fromDate: Joi.date().iso(), toDate: Joi.date().iso().min(Joi.ref("fromDate")), sortBy: Joi.string(), limit: Joi.number().integer().min(1).max(100), page: Joi.number().integer().min(1) }) };
const patientId = { params: Joi.object({ patientId: Joi.string().custom(objectId).required() }) };
const updatePatient = { params: patientId.params, body: Joi.object({ name: Joi.string().trim().max(120), age: Joi.number().integer().min(0).max(130), gender: Joi.string().valid("male", "female", "other", "prefer-not-to-say"), condition: Joi.string().trim().max(240), status, doctor: Joi.string().custom(objectId), appointmentAt: Joi.date().iso().allow(null), notes: Joi.string().allow("", null).max(3000), isActive: Joi.boolean() }).min(1) };
module.exports = { createPatient, getPatients, patientId, updatePatient };
