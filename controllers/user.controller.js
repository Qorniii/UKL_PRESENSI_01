const userModel = require(`../models/index`).users
const md5 = require(`md5`)
const Op = require(`sequelize`).Op


exports.getAllUser = async (request, response) => {
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All Users have been loaded`
    })
}
exports.getUserById = async (request, response) => {
    const { id } = request.params
    let userData = await userModel.findOne({ where: { id: id } })
    if (!userData) {
        return response.status(404).json({
            success: false,
            message: `User with ID ${id} not found`
        })
    }
    userData = {
        id: userData.id,
        name: userData.name,
        username: userData.username,
        role: userData.role
    }

    return response.json({
        status: `success`,
        data: userData
    })
}

exports.findUser = async (request, response) => {
    let keyword = request.body.keyword
    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword }},
                { username: { [Op.substring]: keyword }},
                { role: { [Op.substring]: keyword }},
                { id: { [Op.sub]: keyword }}
            ]
        }
    })
    return response.json({
        success: true,
        data: users,
        message: `All Users have been loaded`
    })
}
exports.addUser = (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }
    userModel.create(newUser).then(result => {
        let userData = {
            id: result.id,
            name: result.name,
            username: result.username,
            role: result.role
        }
        return response.json({
            status: `success`,
            message: `Pengguna berhasil ditambahkan`,
            data: userData
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}
exports.updateUser = (request, response) => {
    let dataUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }
    let idUser = request.params.id
    userModel.update(dataUser, { where: { id: idUser } }).then(() => {
        userModel.findOne({ where: { id: idUser } }).then(updatedUser => {
            let userData = {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                role: updatedUser.role
            }
            return response.json({
                status: `success`,
                message: `Pengguna berhasil diubah`,
                data: userData
            })
        })
        .catch(error => {
            return response.json({
                status: `error`,
                message: `Gagal mengambil data pengguna setelah update`,
                error: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.deleteUser = (request, response) => {
    let idUser = request.params.id
    userModel.destroy({ where: {id: idUser } })
    .then(result => {
        return response.json({
            success: true,
            message: `Data user has been updated`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.getUserByToken = (req, res) => {
    /** define id user that will be retrieved */
    let idUser = req.params.id;

    /** execute get data based on defined id user */
    userModel.findOne({ where: { id: idUser } })
    .then(user => {
        /** if user data is found */
        if (user) {
            return res.json({
                success: true,
                data: user,
                message: 'User data retrieved successfully'
            })
        } else {
            /** if user data is not found */
            return res.json({
                success: false,
                message: 'User not found'
            })
        }
    })
    .catch(error => {
        /** if there is an error in the process */
        return res.json({
            success: false,
            message: error.message
        })
    })
}