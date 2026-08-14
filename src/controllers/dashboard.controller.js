const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { dashboardService } = require("../services");
const pick = require("../utils/pick");
const getDashboard = catchAsync(async (req, res) => { const data = await dashboardService.getDashboard(pick(req.query, ["fromDate", "toDate"])); res.status(httpStatus.OK).json(response({ statusCode: httpStatus.OK, message: "Dashboard analytics retrieved", data })); });
module.exports = { getDashboard };
