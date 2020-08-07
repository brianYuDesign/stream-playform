import express from "express"
import bodyParser from "body-parser"
import helpers from "../helpers"
import { auth } from "../utils"
import { CONSUME_HISTORY_EXCHANGE_TYPE_COIN } from "../constants"

const reportController = express.Router()
const jsonParser = bodyParser.json()

reportController.post("/dealer", jsonParser, async (req, res, next) => {
  try {
    await auth.validateAccessToken(req.body.token)

    const { dealerReports, totalIncome } = await helpers.report.dealerReports({
      pageSize: 99999999,
      filter: {
        dealer: req.body.dealer,
        year: req.body.year,
        month: req.body.month
      }
    })

    const dealer = await helpers.dealer.getById(req.body.dealer)

    const result = helpers.report.generateDelearReportsCsvResult({
      dealerReports,
      totalIncome,
      dealer
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
})

reportController.post("/artist", jsonParser, async (req, res, next) => {
  try {
    await auth.validateAccessToken(req.body.token)
    const { consumeHistories } = await helpers.consumeHistory.consumeHistories({
      pageSize: 9999999,
      filter: {
        artist: req.body.artist,
        year: req.body.year,
        month: req.body.month,
        exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN
      }
    })

    const artist = await helpers.user.getById(req.body.artist)
    const result = helpers.report.generateArtistReportCsvResult({
      consumeHistories,
      artist
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default reportController
