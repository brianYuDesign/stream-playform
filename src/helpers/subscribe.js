import env from "dotenv"
import dataProvider from "../data-provider"
import {
  USER_SUBSCRIBE_STATUS_SUBSCRIBE,
  CONSUME_HISTORY_TYPE_SUBSCRIBE,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
  REDIS_SUBSCRIBEING_COIN
} from "../constants"
import helpers from "."
import { intercom } from "../services"
import redisClient from "../redis/connection"

env.config()
const { SUBSCRIBEING_COIN } = process.env

const createSubscriptionArtist = async ({ subscribing, user }) => {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  try {
    if (
      !(await dataProvider.subscribe.getOne({
        artist: subscribing.target,
        creator: user.id,
        year,
        month
      }))
    ) {
      if (
        user.subscribing.length *
          Number(
            (await redisClient.get(REDIS_SUBSCRIBEING_COIN)) ||
              SUBSCRIBEING_COIN
          ) >
        user.coin
      ) {
        const intercomUser = await intercom.getUserByUserId(user.id)
        await intercom.createMessage({
          clientId: intercomUser.id,
          body: "您的寶石不夠無法訂閱，需要充值寶石"
        })
        return
      }

      const subscribe = await dataProvider.subscribe.create({
        input: {
          artist: subscribing.target,
          year,
          month
        },
        user
      })
      await helpers.consumeHistory.createConsumeHistory({
        input: {
          type: CONSUME_HISTORY_TYPE_SUBSCRIBE,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          subscribe: subscribe.id,
          coin: Number(
            (await redisClient.get(REDIS_SUBSCRIBEING_COIN)) ||
              SUBSCRIBEING_COIN
          ),
          artist: subscribe.artist,
          timeStamp: Date.now()
        },
        user
      })

      await helpers.voucher.convertSubscribeToVoucher(subscribe)
    }
  } catch (error) {
    throw new Error(error)
  }
}
export default {
  ...dataProvider.subscribe,
  async createSubscriptionArtistSchedule() {
    const subscribeUsers = await dataProvider.user.getByFilter({
      "subscribing.status": USER_SUBSCRIBE_STATUS_SUBSCRIBE
    })

    subscribeUsers.map(async user => {
      await Promise.all(
        user.subscribing
          .filter(item => item.status === USER_SUBSCRIBE_STATUS_SUBSCRIBE)
          .map(async subscribingItem =>
            createSubscriptionArtist({
              subscribing: subscribingItem,
              user
            })
          )
      )
    })
  },
  createSubscriptionArtist
}
