import env from "dotenv"
import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"
import {
  VOUCHER_TYPE_UNLOCK_STORY,
  VOUCHER_TYPE_UNLOCK_CHAT,
  VOUCHER_STATUS_ACTIVED,
  VOUCHER_SOURCE_SUBSCIBING,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY
} from "../../src/constants"
import redisClient from "../../src/redis/connection"

let user, dealer, chatroom, artist

env.config()
const {
  SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
  SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
} = process.env

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  artist = await helpers.user.getOne({ name: "bruno" })

  dealer = await helpers.dealer.create({
    input: { name: "5e4b7bdfc88999092004b3c6" }
  })
  chatroom = await helpers.chatroom.create({
    input: user
  })
})

describe("helpers-consumeHistory", async () => {
  it("consumeHistories", async () => {
    const result = await helpers.consumeHistory.consumeHistories({
      pageSize: 10
    })

    expect(result.totalPage).to.equal(1)
  })

  it("createVoucherConsumeHistory", async () => {
    const voucherCreateInput = {
      source: VOUCHER_SOURCE_SUBSCIBING,
      type: VOUCHER_TYPE_UNLOCK_STORY,
      status: VOUCHER_STATUS_ACTIVED,
      year: 2020,
      month: 3,
      artist: artist.id,
      quantity: Number(
        (await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY)) ||
          SUBSCRIBING_REWARD_OF_UNLOCK_STORY
      )
    }

    const newVoucher = await helpers.voucher.create({
      input: { ...voucherCreateInput, creator: user._id, owner: user._id }
    })
  })
  // it("validateFactory", async () => {

  // })
  // it("createConsumeHistory", async () => {
  //   console.log(user)
  //   const isConsumeHistoryExist = await helpers.consumeHistory.getOne({})
  // })
  // it("update", async () => {
  //   const consumeHistoryUpdateInput = {
  //     coin: 100
  //   }
  //   const consumeHistory = await helpers.consumeHistory.getOne({
  //     chatroom: "5e7ac86a070e1c412d70dbe9"
  //   })
  //   const updateConsumeHistory = await helpers.consumeHistory.update({
  //     id: consumeHistory.id,
  //     input: consumeHistoryUpdateInput
  //   })

  //   expect(updateConsumeHistory).to.have.property("id")
  //   expect(updateConsumeHistory.coin).to.be.equal(100)
  // })
})
