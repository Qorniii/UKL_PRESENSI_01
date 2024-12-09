const attendanceModel = require(`../models/index`).attendances
const userModel = require(`../models/index`).users
const Op = require(`sequelize`).Op
const attendance = require(`../models/attendances`)
const moment = require(`moment`)


exports.addAttendance = (request, response) => {
    let newAttendance = {
        user_id: request.body.user_id,
        date: request.body.date,
        time: request.body.time,
        status: request.body.status
    }
    attendanceModel.create(newAttendance)
    .then(result => {
        let attendanceData = {
            attendance_id: result.id,
            user_id: result.user_id,
            date: result.date,
            time: result.time,
            status: result.status
        }
        return response.json({
            status: `success`,
            message: `Presensi berhasil dicatat`,
            data: attendanceData
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getAllAttendance = async (request, response) => {
    let attendances = await attendanceModel.findAll()
    return response.json({
        success: true,
        data: attendances,
        message: `All Users have been loaded`
    })
}

exports.getByUserId = async (request, response) => {
    const { user_id } = request.params
    let attendData = await attendanceModel.findOne({ where: { user_id: user_id } })
    if (!attendData) {
        return response.status(404).json({
            success: false,
            message: `User with ID ${user_id} not found`
        })
    }
    attendData = {
        attendance_id: attendData.attendance_id,
        date: attendData.date,
        time: attendData.time,
        status: attendData.status
    }

    return response.json({
        status: `success`,
        data: attendData
    })
}

exports.getAttendanceSummary = (request, res) => {
    let idUser = request.params.user_id;
    let currentMonth = moment().format('MM-YYYY');

    // Query to get summary of attendance for a user in the current month
    attendanceModel.findAll({
        where: {
            user_id: idUser,
            date: {
                [Op.startsWith]: `${moment().year()}-${currentMonth.split('-')[0]}`
            }
        }
    })
    .then(attendances => {
        let summary = {
            hadir: 0,
            izin: 0,
            sakit: 0,
            alpa: 0
        }

        attendances.forEach(attendance => {
            if (attendance.status === 'hadir') {
                summary.hadir += 1;
            } else if (attendance.status === 'izin') {
                summary.izin += 1;
            } else if (attendance.status === 'sakit') {
                summary.sakit += 1;
            } else if (attendance.status === 'alpa') {
                summary.alpa += 1;
            }
        })

        return res.json({
            status: "success",
            data: {
                user_id: idUser,
                month: currentMonth,
                attendance_summary: summary
            }
        });
    })
    .catch(error => {
        return res.json({
            status: "error",
            message: error.message,
        })
    })
}