import express from "express"
import env from "dotenv"
import helpers from "../helpers"

env.config()
const { FRONTEND_HOST } = process.env
const shareController = express.Router()

const SOURCE_LIST = ["facebook", "line", "web"]

shareController.get("/", async (req, res, next) => {
  const { promotionCode, redirectUrl, source } = req.query
  if (!promotionCode || !source) {
    next("請填入推廣碼與推廣來源")
    return
  }

  const user = await helpers.user.getOne({ promotionCode })
  if (!user) {
    next("推薦碼輸入有誤")
    return
  }

  if (!SOURCE_LIST.includes(source)) {
    next("分享來源輸入有誤")
    return
  }

  await helpers.share.create({
    input: {
      promotionCode,
      redirectUrl,
      source,
      dealer: user.dealer,
      referrer: user.id
    }
  })
  // 上限需要更改前端uri
  res.redirect(
    `${redirectUrl}&referrer=${user.id}&referrerUid=${user.uid}` ||
      `${FRONTEND_HOST}/register?referrer=${user.id}&referrerUid=${user.uid}`
  )
})

export default shareController
