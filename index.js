const express = require(`express`)
const app = express()
const PORT = 4545
const cors = require(`cors`)

app.use(cors())

const attendRoute = require(`./routes/attendance.route`)
app.use(`/api/attendance`,attendRoute)

const userRoute = require(`./routes/user.route`)
app.use(`/api/user`,userRoute)

const auth = require(`./routes/auth.route`)
app.use(`/api/auth/login`, auth)

app.listen(PORT, () => {
    console.log(`server runs on port ${PORT}`)
})