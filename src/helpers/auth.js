import randomize from "randomatic"
import { hash, compare } from "bcrypt"
import {
  USER_SOURCE_CUSTOM,
  USER_SCOPE_FRONT,
  USER_SCOPE_BACK,
  USER_SOURCE_BACK,
  EMAIL_EVENT_REGISTER,
  EMAIL_EVENT_FORGOT_PASSWORD
} from "../constants"
import { auth, sendEmail, stringCompare } from "../utils"
import { passportService } from "../services"
import helpers from "."

const SALT_ROUNDS = 10

export default {
  refreshToken: async ({ refreshToken }, res) => {
    try {
      if (!refreshToken) {
        throw new Error("請輸入完整參數 {refreshToken:??}")
      }

      const user = await auth.validateRefreshToken(refreshToken)
      const newAccessToken = await auth.createAccessToken(user, user.env)
      const newRefreshToken = await auth.createRefreshToken(user, user.env)

      res.cookie("access-token", newAccessToken)
      res.cookie("refresh-token", newRefreshToken)

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  loginWithFacebook: async ({ token }, res) => {
    try {
      if (!token) {
        throw new Error("請輸入完整參數 {token:??}")
      }
      const { data, info } = await passportService.authenticateFacebook({
        body: {
          access_token: token
        }
      })

      if (info) {
        throw new Error(`token有誤 ${info.message}`)
      }

      const user = await helpers.user.upsertFacebookUser(data.profile)
      const accessToken = await auth.createAccessToken(user, "FRONT")
      const refreshToken = await auth.createRefreshToken(user, "FRONT")

      res.cookie("access-token", accessToken)
      res.cookie("refresh-token", refreshToken)

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  loginWithGoogle: async ({ token }, res) => {
    try {
      if (!token) {
        throw new Error("請輸入完整參數 {token:??}")
      }
      const { data, info } = await passportService.authenticateGoogle({
        body: {
          id_token: token
        }
      })

      if (info) {
        throw new Error(`token有誤 ${info.message}`)
      }

      const user = await helpers.user.upsertGoogleUser(data.parsedToken.payload)
      const accessToken = await auth.createAccessToken(user, "FRONT")
      const refreshToken = await auth.createRefreshToken(user, "FRONT")

      res.cookie("access-token", accessToken)
      res.cookie("refresh-token", refreshToken)

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  login: async ({ email, password, env }, res) => {
    try {
      if (!email || !password || !env) {
        throw new Error(
          "請輸入完整參數 {email:??, password:??, env:APP||FRONT||BACK}"
        )
      }
      if (!["APP", "FRONT", "BACK"].includes(env)) {
        throw new Error("請帶入對應的 env")
      }

      const user = await helpers.user.getOne({
        email,
        source: { $in: [USER_SOURCE_CUSTOM, USER_SOURCE_BACK] },
        scope:
          env === "APP" || env === "FRONT" ? USER_SCOPE_FRONT : USER_SCOPE_BACK
      })

      if (!user) {
        throw new Error("電子郵件不存在")
      }

      if (user.loginFailedTime === 3 && user.loginBlockUntil > new Date()) {
        throw new Error("使用者封鎖")
      }

      if (!user.isEnabled) {
        throw new Error("此使用者已停用")
      }

      const passwordIsValid = await compare(password, user.password)
      if (!passwordIsValid) {
        const passwordErrorUser = await helpers.user.update({
          id: user.id,
          input: { $inc: { loginFailedTime: 1 } }
        })

        if (passwordErrorUser.loginFailedTime === 3) {
          await helpers.user.update({
            id: passwordErrorUser.id,
            input: {
              loginBlockUntil: new Date(
                new Date().setHours(new Date().getHours() + 1)
              )
            }
          })
        }

        throw new Error("輸入密碼有誤")
      }

      await helpers.user.update({
        id: user.id,
        input: { loginErrorTime: 0, loginFailedTime: null }
      })

      const accessToken = await auth.createAccessToken(user, env)
      const refreshToken = await auth.createRefreshToken(user, env)

      res.cookie("access-token", accessToken)
      res.cookie("refresh-token", refreshToken)

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  register: async (
    { email, password, confirmPassword, verifyCode, referrer },
    res
  ) => {
    try {
      if (!email || !password || !confirmPassword || !verifyCode) {
        throw new Error(
          "請輸入完整註冊資訊 {email:??, password:??, confirmPassword:??, verifyCode:??}"
        )
      }

      if (password !== confirmPassword) {
        throw new Error("密碼與確認密碼有誤")
      }

      let newUser = await helpers.user.getOne({
        email,
        source: USER_SOURCE_CUSTOM,
        scope: USER_SCOPE_FRONT
      })

      if (newUser.isEnabled) {
        throw new Error("您已重複註冊")
      }

      if (!stringCompare(verifyCode, newUser.verifyCode)) {
        throw new Error("輸入的驗證碼有誤")
      }

      if (referrer && !(await helpers.user.getById(referrer))) {
        throw new Error("referrer Error")
      }

      newUser = await helpers.user.update({
        id: newUser.id,
        input: {
          password: await hash(password, SALT_ROUNDS),
          isPasswordNeedToChange: false,
          isEnabled: true,
          referrer
        }
      })

      const accessToken = await auth.createAccessToken(newUser, "FRONT")
      const refreshToken = await auth.createRefreshToken(newUser, "FRONT")

      res.cookie("access-token", accessToken)
      res.cookie("refresh-token", refreshToken)

      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  sendVerifyCode: async ({ email }) => {
    try {
      if (!email) {
        throw new Error("請輸入完整參數 {email:??}")
      }
      const existUser = await helpers.user.getOne({
        email,
        source: { $in: [USER_SOURCE_CUSTOM, USER_SOURCE_BACK] },
        scope: USER_SCOPE_FRONT
      })

      const verifyCode = randomize("A0", 6)

      if (!existUser) {
        sendEmail({
          event: EMAIL_EVENT_REGISTER,
          email,
          subject: "信箱驗證信",
          content: `您的驗證瑪為 ${verifyCode}`
        })
        await helpers.user.create({
          input: {
            email,
            verifyCode,
            source: USER_SOURCE_CUSTOM,
            scope: USER_SCOPE_FRONT,
            roleFeature: await helpers.roleFeature.getRoleClientId(),
            uid: await helpers.user.generateUniqueUid(),
            promotionCode: await helpers.user.generateUniquePromotionCode(),
            isEnabled: false
          }
        })
        return true
      }

      if (existUser.isEnabled) {
        throw new Error("此信箱已經有人註冊了!")
      } else {
        sendEmail({
          event: EMAIL_EVENT_REGISTER,
          email,
          subject: "信箱驗證信",
          content: `您的驗證瑪為 ${verifyCode}`
        })
        await helpers.user.update({ id: existUser, input: { verifyCode } })
        return true
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  forgotPassword: async ({ email, env }) => {
    try {
      if (!email || !env) {
        throw new Error("請輸入完整參數{email : ??, env: APP || FRONT || BACK}")
      }

      if (!["APP", "FRONT", "BACK"].includes(env)) {
        throw new Error("請帶入對應的 env")
      }

      const isExistEmailUser = await helpers.user.getOne({
        email,
        source: { $in: [USER_SOURCE_CUSTOM, USER_SOURCE_BACK] },
        scope:
          env === "APP" || env === "FRONT" ? USER_SCOPE_FRONT : USER_SCOPE_BACK
      })

      if (!isExistEmailUser) {
        throw new Error("電子郵件不存在")
      }

      const tempPassword = randomize("A0", 8)
      await helpers.user.update({
        id: isExistEmailUser.id,
        input: {
          isPasswordNeedToChange: true,
          password: await hash(tempPassword, SALT_ROUNDS)
        }
      })

      sendEmail({
        event: EMAIL_EVENT_FORGOT_PASSWORD,
        email,
        subject: "忘記密碼信件",
        content: `您的暫時密碼為${tempPassword}`
      })
      return true
    } catch (error) {
      throw new Error(error)
    }
  }
}
