import express from "express"
import bodyParser from "body-parser"
import helpers from "../helpers"

const authController = express.Router()
const jsonParser = bodyParser.json()

authController.post("/refreshtoken", jsonParser, (req, res, next) => {
  helpers.auth
    .refreshToken({ refreshToken: req.body.refreshToken }, res)
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/facebook-login", jsonParser, (req, res, next) => {
  helpers.auth
    .loginWithFacebook({ token: req.body.token }, res)
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/google-login", jsonParser, (req, res, next) => {
  helpers.auth
    .loginWithGoogle({ token: req.body.token }, res)
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/register", jsonParser, (req, res, next) => {
  helpers.auth
    .register(
      {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        verifyCode: req.body.verifyCode,
        referrer: req.body.referrer
      },
      res
    )
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/login", jsonParser, (req, res, next) => {
  helpers.auth
    .login(
      {
        email: req.body.email,
        password: req.body.password,
        env: req.body.env
      },
      res
    )
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/logout", (req, res, next) => {
  res.clearCookie("access-token")
  res.clearCookie("refresh-token")
})

authController.post("/send-verifycode", jsonParser, (req, res, next) => {
  helpers.auth
    .sendVerifyCode({ email: req.body.email })
    .then(result => res.json(result))
    .catch(error => next(error))
})

authController.post("/forgot-password", jsonParser, (req, res, next) => {
  helpers.auth
    .forgotPassword({ email: req.body.email, env: req.body.env })
    .then(result => res.json(result))
    .catch(error => next(error))
})

export default authController
