const express = require ('express')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const userModel= require('../models/index').users

const authenticate = async (request,response)=>{
        let dataLogin = {
            username : request.body.username,
            password : md5(request.body.password)
        }
        let dataUser = await userModel.findOne({where:dataLogin})
        if(dataUser){
            let payload = JSON.stringify(dataUser)
            let secret = 'mokleters'
            let token = jwt.sign(payload,secret)

            return response.json({
                succes:true,
                message:'Sukses sam',
                token : token,
            })
        }

        return response.json({
            succes:false,
            logged:false,
            message:'Auth failed invalid user or pass'
        })
}

const authorize = (request,response,next) => {
    let headers = request.headers.authorization

    let tokenKey = headers && headers.split(" ")[1]

    if (tokenKey == null){
        return response.json({
            success: false,
            message : 'Unauthorized user'
        })
    }

    let secret = 'mokleters'

    jwt.verify(tokenKey,secret,(error,user)=>{
        if(error){
            return response.json({
                succes:false,
                message:'Invalid token'
            })
        }
    })

    next()
}

module.exports =  { authenticate,authorize }