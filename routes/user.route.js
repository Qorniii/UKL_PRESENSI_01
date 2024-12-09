const express = require(`express`)
const app = express()
let { validateUser } = require(`../middlewares/user-validation`)

app.use(express.json())
const userController = require(`../controllers/user.controller`)
const { authorize } = require(`../controllers/auth.controller`)
app.get("/", [authorize], userController.getAllUser)
app.get("/:id",[authorize], userController.getUserById)
app.post("/",[validateUser], userController.addUser)
app.post("/find",[authorize], userController.findUser)
app.put("/:id",[authorize], userController.updateUser)
app.delete("/:id",[authorize], userController.deleteUser)

module.exports = app