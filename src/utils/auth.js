import jwt from "jsonwebtoken"
import { AuthenticationError, ForbiddenError } from "apollo-server-express"
import permissonSet from "../permissionSet"
import helpers from "../helpers"

const SECRET = "BrianYuDesign"

const isAuthenticated = async (_, _args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError("找不到此使用者")
  }

  const role = await helpers.roleFeature.getById(context.user.roleFeature)

  if (!permissonSet[info.fieldName]) {
    throw new Error(`系統設定有誤 ${info.fieldName}`)
  }

  if (role && !permissonSet[info.fieldName].includes(role.name)) {
    throw new ForbiddenError(`沒有權限操作 ${info.fieldName} 此API`)
  }

  await helpers.log.createLog({
    user: context.user,
    input: { api: info.fieldName }
  })
}

const createAccessToken = async ({
  id,
  uid,
  email,
  avatar,
  roleFeature,
  isPasswordNeedToChange
}) => {
  return jwt.sign(
    {
      id,
      uid,
      email,
      avatar,
      roleFeature: (await helpers.roleFeature.getById(roleFeature)).name,
      isPasswordNeedToChange
    },
    SECRET,
    { expiresIn: "60m" }
  )
}

const createRefreshToken = async ({ id, uid, email }) => {
  return jwt.sign(
    {
      id,
      uid,
      email
    },
    SECRET,
    { expiresIn: "30days" }
  )
}

const validateAccessToken = async accessToken => {
  try {
    const result = jwt.verify(accessToken, SECRET)

    const user = await helpers.user.getById(result.id)

    if (!user) {
      throw new AuthenticationError("使用者不存在")
    }

    if (!user.isEnabled) {
      throw new AuthenticationError("您的帳戶已經停用")
    }
    return user
  } catch (error) {
    throw new AuthenticationError(error)
  }
}

const validateRefreshToken = async refreshToken => {
  try {
    const result = jwt.verify(refreshToken, SECRET)

    const user = await helpers.user.getById(result.id)

    if (!user) {
      throw new AuthenticationError("使用者不存在")
    }

    if (!user.isEnabled) {
      throw new AuthenticationError("您的帳戶已經停用")
    }

    return user
  } catch (error) {
    throw new AuthenticationError(error)
  }
}

export default {
  isAuthenticated,
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateRefreshToken
}
