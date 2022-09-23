const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const {Tokens,User} = require('../models')
// const UserToken = require('../Models/Token.model')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '1h',
                issuer: 'pickurpage.com',
                audience : userId.toString()

            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'jsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },

    signRefreshToken :   (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer: 'pickurpage.com',
                audience : userId.toString()

            }
            JWT.sign(payload, secret, options, async(err, token) => {
                if (err) {
                    // console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())
                }
                const doesExist = await Tokens.findOne({ where: { userId }})
                if (doesExist) {
                    doesExist.token = token
                    await doesExist.save()
                } else {
                    await  Tokens.create({ userId, token })
                }
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud
                const doesExist = await Tokens.findOne({ where: { userId }})
                if (doesExist) {
                    if (refreshToken === doesExist.token) return resolve(userId)
                    reject(createError.Unauthorized())
                } else {
                    reject(createError.NotFound())
                }
                resolve(userId)
            })
        })
    }
}