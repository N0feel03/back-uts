const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())

//conexion a la base de datos
const url = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@cluster0.x8a1zcz.mongodb.net/${process.env.DBNAME}`
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a la Base de Datos!!!'))
  .catch((error) => console.log('Error: ' + error))

//creacion e importacion de rutas
const authRoutes = require('./routes/auth')

//ruta del middleware
app.use('/api/user', authRoutes)

//ruta raiz o ruta incial
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Si funciona... vamos a comer!!!'
    })
})

//Arrancamos el servidor

const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`)
})