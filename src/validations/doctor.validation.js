const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createDoctor = { body: Joi.object({ name: Joi.string().trim().max(120).required(), specialization: Joi.string().trim().max(120).required(), hospital: Joi.string().trim().max(160).required(), phone: Joi.string().trim().max(30).required(), email: Joi.string().email().required(), isActive: Joi.boolean() }) };
const getDoctors = { query: Joi.object({ search: Joi.string().allow(""), specialization: Joi.string(), hospital: Joi.string(), isActive: Joi.boolean(), fromDate: Joi.date().iso(), toDate: Joi.date().iso().min(Joi.ref("fromDate")), sortBy: Joi.string(), limit: Joi.number().integer().min(1).max(100), page: Joi.number().integer().min(1) }) };
const doctorId = { params: Joi.object({ doctorId: Joi.string().custom(objectId).required() }) };
const updateDoctor = { params: doctorId.params, body: Joi.object({ name: Joi.string().trim().max(120), specialization: Joi.string().trim().max(120), hospital: Joi.string().trim().max(160), phone: Joi.string().trim().max(30), email: Joi.string().email(), isActive: Joi.boolean() }).min(1) };
module.exports = { createDoctor, getDoctors, doctorId, updateDoctor };
