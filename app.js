const express = require('express')
const createError = require('http-errors')
const morgan = require('morgan')
require('dotenv').config()
const cors = require("cors");
const compression = require('compression')
const AuthRoute = require('./routes/Auth.Route')
const indexRoutes = require('./routes/index.routes')


const app = express()
app.use(morgan('dev'))
app.use(compression())
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',async (req, res, next) => {
    res.send("Hello from express")
})


app.use('/api',indexRoutes)
app.use('/auth',AuthRoute)


app.use(async (req, res, next) => {
    next(createError.NotFound("This route does not exist"))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500) 
    res.send({
        error: {
            status: err.status || 500,
            message : err.message,
        }
    })
})

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})