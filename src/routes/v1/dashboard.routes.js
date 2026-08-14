const express = require("express");
const Joi = require("joi");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const dashboardController = require("../../controllers/dashboard.controller");
const router = express.Router();
router.get("/", auth("commonAdmin"), validate({ query: Joi.object({ fromDate: Joi.date().iso(), toDate: Joi.date().iso().min(Joi.ref("fromDate")) }) }), dashboardController.getDashboard);
module.exports = router;
