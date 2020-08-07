import dateformat from "dateformat"
import env from "dotenv"
import { UserInputError } from "apollo-server-express"
import dataProvider from "../data-provider"
import { ezPayService } from "../services"
import {
  ORDER_STATUS_SUCCESS,
  ORDER_STATUS_FAIL,
  RECORD_TYPE_BUYING,
  RECORD_TYPE_REWARD
} from "../constants"
import helpers from "."

env.config()
const { EZPAY_KEY, EZPAY_IV } = process.env

export default {
  ...dataProvider.order,
  orders: async ({ pageSize = 10, pageNumber, filter }) => {
    const results = await dataProvider.order.paginate(
      {
        ...(filter &&
          filter.orderNumber && {
            orderNumber: { $regex: filter.orderNumber, $options: "i" }
          }),
        ...(filter &&
          filter.tradeNumber && {
            tradeNumber: { $regex: filter.tradeNumber, $options: "i" }
          }),
        ...(filter && filter.creator && { creator: filter.creator })
      },
      { pageSize, pageNumber, sort: { createdAt: "-1" } }
    )

    return {
      totalPage: results.totalPages,
      orders: results.docs
    }
  },
  async createOrder({ input, user }) {
    const coin = await dataProvider.coin.getById(input.coin)
    if (!coin) {
      throw new UserInputError("系統錯誤，請洽管理員")
    }

    const order = await dataProvider.order.create({
      input: {
        ...input,
        orderNumber: await this.getOrderNumber(),
        price: coin.price,
        coinQuantity: coin.quantity
      },
      user
    })

    const inputString = await ezPayService.createOrderInputString({
      order,
      user
    })

    const aes = await ezPayService.createAESEncrypt(
      inputString,
      EZPAY_KEY,
      EZPAY_IV
    )
    const sha = ezPayService.createShaEncrypt(aes, EZPAY_KEY, EZPAY_IV)

    return dataProvider.order.update({
      id: order.id,
      input: { aes, sha },
      user
    })
  },
  getOrderNumber: async () => {
    const result = await dataProvider.order
      .getByFilter({
        orderNumber: { $ne: null },
        createdAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      })
      .sort({
        createdAt: -1
      })

    if (result.length === 0) {
      return `K${dateformat(new Date(), "yyyymmdd")}000001`
    }

    const { orderNumber } = result[0]
    const currentNumberString = `K${dateformat(new Date(), "yyyymmdd")}`
    const previousNumber = Number(orderNumber.substr(orderNumber.length - 6, 6))
    const currentNumber = previousNumber + 1

    if (currentNumber < 10) {
      return `${currentNumberString}00000${currentNumber}`
    }

    if (currentNumber < 100) {
      return `${currentNumberString}0000${currentNumber}`
    }

    if (currentNumber < 1000) {
      return `${currentNumberString}000${currentNumber}`
    }

    if (currentNumber < 10000) {
      return `${currentNumberString}00${currentNumber}`
    }

    if (currentNumber < 100000) {
      return `${currentNumberString}0${currentNumber}`
    }

    return `${currentNumberString}${currentNumber}`
  },
  updateOrderFromEZPayWebhook: async req => {
    try {
      const chain = ezPayService.getDecryptTradeInfo(
        req.body.TradeInfo,
        EZPAY_KEY,
        EZPAY_IV
      )
      const result = ezPayService.getResultByChain(chain)

      let order = await dataProvider.order.getOne({
        orderNumber: result.MerchantOrderNo
      })

      order = await dataProvider.order.update({
        id: order.id,
        input: {
          tradeNumber: result.TradeNo,
          status:
            result.Status === "SUCCESS"
              ? ORDER_STATUS_SUCCESS
              : ORDER_STATUS_FAIL,
          statusMessage: result.Message,
          payTime: result.PayTime ? new Date() : null
        }
      })

      // 日誌更新
      if (order.status === ORDER_STATUS_SUCCESS) {
        const user = await helpers.user.getById(order.creator)

        await helpers.record.convertArgToRecord(
          { order },
          RECORD_TYPE_BUYING,
          order.coinQuantity,
          user,
          user.id
        )

        const promotionReward = await helpers.promotion.getOrderPromotionReward(
          order
        )
        if (promotionReward) {
          await helpers.record.convertArgToRecord(
            {
              reward: promotionReward.reward
            },
            RECORD_TYPE_REWARD,
            promotionReward.reward.reward,
            user,
            user.id
          )
        }
      }

      return order
    } catch (error) {
      throw new Error(error)
    }
  }
}
