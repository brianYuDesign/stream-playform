import env from "dotenv"
import {
  VOUCHER_TYPE_UNLOCK_STORY,
  VOUCHER_TYPE_UNLOCK_CHAT,
  VOUCHER_STATUS_ACTIVED,
  VOUCHER_SOURCE_SUBSCIBING,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY
} from "../constants"
import dataProvider from "../data-provider"
import redisClient from "../redis/connection"

env.config()
const {
  SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
  SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
} = process.env

export default {
  ...dataProvider.voucher,
  artistVouchers: async ({ filter, user }) => [
    ...(await dataProvider.voucher.getByFilter({
      ...(filter && filter.artist && { artist: filter.artist }),
      ...(filter && filter.type && { type: filter.type }),
      status: VOUCHER_STATUS_ACTIVED,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      owner: user.id
    })),
    ...(await dataProvider.voucher.getByFilter({
      ...(filter && filter.artist && { artist: filter.artist }),
      ...(filter && filter.type && { type: filter.type }),
      status: VOUCHER_STATUS_ACTIVED,
      year: null,
      month: null,
      owner: user.id
    }))
  ],
  async convertSubscribeToVoucher(subscribe) {
    // create StoryVoucher
    const vouchers = []
    vouchers.push(
      ...this.createNewVouchers({
        source: VOUCHER_SOURCE_SUBSCIBING,
        type: VOUCHER_TYPE_UNLOCK_STORY,
        status: VOUCHER_STATUS_ACTIVED,
        year: subscribe.year,
        month: subscribe.month,
        artist: subscribe.artist,
        owner: subscribe.creator,
        creator: subscribe.creator,
        quantity: Number(
          (await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY)) ||
            SUBSCRIBING_REWARD_OF_UNLOCK_STORY
        )
      })
    )

    vouchers.push(
      ...this.createNewVouchers({
        source: VOUCHER_SOURCE_SUBSCIBING,
        type: VOUCHER_TYPE_UNLOCK_CHAT,
        status: VOUCHER_STATUS_ACTIVED,
        year: subscribe.year,
        month: subscribe.month,
        artist: subscribe.artist,
        owner: subscribe.creator,
        creator: subscribe.creator,
        quantity: Number(
          (await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT)) ||
            SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
        )
      })
    )

    return dataProvider.voucher.insertMany(vouchers)
  },
  createNewVouchers: ({
    source,
    type,
    status = VOUCHER_STATUS_ACTIVED,
    year,
    month,
    artist,
    owner,
    creator,
    quantity = 1
  }) => {
    const vouchers = []
    for (let i = 0; i < quantity; i += 1) {
      vouchers.push({
        source,
        type,
        status,
        year,
        month,
        artist,
        owner,
        creator
      })
    }
    return vouchers
  }
}
