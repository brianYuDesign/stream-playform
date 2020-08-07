import { auth } from "../utils"

export default async (req, res, next) => {
  const accessToken = req.body["access-token"]
  if (!accessToken) {
    const err = new Error("access-token is not valid")
    err.status = 400
    return next(err)
  }

  try {
    const user = await auth.validateAccessToken(accessToken)
    req.user = user
    return next() // No error proceed to next middleware
  } catch (error) {
    const err = new Error("Not authorized! Go back!")
    err.status = 400
    return next(err)
  }
}
