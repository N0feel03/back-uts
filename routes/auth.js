const router = require('express').Router()
const { request } = require('express')
const User = require('../models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().max(1024).required(),
    password: Joi.string().min(6).required()
})

router.post('/register', async(req, res) => {
    //validacion de usuario
    const { error } = schemaRegister.validate(req.body)
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const isEmailUnique = await User.findOne({ email: req.body.email })
    if (isEmailUnique){
        return res.status(400).json({
            error: "El correo ya existe"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordEncriptado = await bcrypt.hash(req.body.password, salt)

    const usuario = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: passwordEncriptado,
    })

    try{
        const guardado = await usuario.save()
        res.json({
            message: 'Success',
            data: guardado
        })
    } catch (error){
        res.status(400).json({
            message: 'Error al Guardar',
            error
        })
    }
})

module.exports = router