import express from "express"
import bodyParser from "body-parser"
import env from "dotenv"
import helpers from "../helpers"

env.config()
const { FRONTEND_HOST } = process.env
const orderController = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

orderController.post("/return", urlencodedParser, async (req, res, next) => {
  try {
    const order = await helpers.order.updateOrderFromEZPayWebhook(req)
    await helpers.invoice.createInvoice({ order })
    res.redirect(`${FRONTEND_HOST}/transactiondetail?order_id=${order.id}`)
  } catch (error) {
    next(error)
  }
})

export default orderController
