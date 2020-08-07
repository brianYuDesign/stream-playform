import env from "dotenv"
import { before } from "mocha"
import { expect } from "chai"
import {
  USER_SUBSCRIBE_STATUS_SUBSCRIBE,
  CONSUME_HISTORY_TYPE_SUBSCRIBE,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
  REDIS_SUBSCRIBEING_COIN
} from "../../src/constants"
import redisClient from "../../src/redis/connection"
import helpers from "../../src/helpers"

env.config()
const { SUBSCRIBEING_COIN } = process.env

let user, artist, subscribingUser

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  artist = await helpers.user.getOne({ name: "bruno" })
  subscribingUser = await helpers.user.getOne({ name: "wunhowBack" })
  artist = await helpers.user.create({
    input: {
      name: "5e4b91ffc6d53d248f03f06e"
    }
  })
})

describe("helpers-subscribe", async () => {
  it("createSubscriptionArtist", async () => {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const subscribeCreateInput = {
      year,
      month,
      creator: user._id,
      artist: artist._id
    }

    const newSubscribe = await helpers.subscribe.create({
      input: subscribeCreateInput,
      user
    })

    const updateUser = await helpers.user.updateUser({
      id: user.id,
      input: {
        ...user,
        subscribing: [
          {
            target: subscribingUser.id,
            status: "SUBSCRIBE",
            subscribeAt: "2020-03-16T14:15:02.478+08:00"
          }
        ],
        coin: 500001
      }
    })

    if (
      user.subscribing.length *
        Number(
          (await redisClient.get(REDIS_SUBSCRIBEING_COIN)) || SUBSCRIBEING_COIN
        ) >
      user.coin
    ) {
      throw new Error("您的寶石不夠無法訂閱，需要充值寶")
    }
    const createSubscriptionArtist = await helpers.subscribe.createSubscriptionArtistSchedule()
    expect(newSubscribe).to.have.property("id")
  })
})
