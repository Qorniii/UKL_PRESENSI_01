const express = require('express');
const app = express();

app.use(express.json());

const attendanceController = require('../controllers/attendance.controller');
const { authorize } = require(`../controllers/auth.controller`)

let { validateAttendanceInput } = require(`../middlewares/attendance-validation`)

app.post("/", [authorize, validateAttendanceInput], attendanceController.addAttendance)

// Routes untuk presensi
app.get('/', [authorize], attendanceController.getAllAttendance)
app.get("/history/:user_id", [authorize], attendanceController.getByUserId)
app.get("/summary/:user_id", [authorize], attendanceController.getAttendanceSummary)


module.exports = app;