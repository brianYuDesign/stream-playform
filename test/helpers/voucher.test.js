import env from "dotenv"
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

env.config()
const {
  SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
  SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
} = process.env

describe("helpers-voucher", async () => {
  it("convertSubscribeToVoucherStory", async () => {
    let artist = await helpers.user.getOne({ name: "bruno" })
    let user = helpers.user.getOne({ name: "brianBack" })
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

    expect(newVoucher).to.have.property("id")
  })

  it("convertSubscribeToVoucherChat", async () => {
    let artist = await helpers.user.getOne({ name: "bruno" })
    let user = helpers.user.getOne({ name: "brianBack" })
    const voucherCreateInput = {
      source: VOUCHER_SOURCE_SUBSCIBING,
      type: VOUCHER_TYPE_UNLOCK_CHAT,
      status: VOUCHER_STATUS_ACTIVED,
      year: 2020,
      month: 3,
      artist: artist.id,
      quantity: Number(
        (await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT)) ||
          SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
      )
    }

    const newVoucher = await helpers.voucher.create({
      input: { ...voucherCreateInput, creator: user._id, owner: user._id }
    })

    expect(newVoucher).to.have.property("id")
  })

  it("artistVouchers", async () => {
    let user = await helpers.user.getOne({ name: "brianBack" })
    let filter = await helpers.voucher.getAll()
    const artistVouchers = [
      ...(await helpers.voucher.getByFilter({
        ...(filter && filter.artist && { artist: filter.artist }),
        ...(filter && filter.type && { type: filter.type }),
        status: VOUCHER_STATUS_ACTIVED,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        owner: user.id
      })),
      ...(await helpers.voucher.getByFilter({
        ...(filter && filter.artist && { artist: filter.artist }),
        ...(filter && filter.type && { type: filter.type }),
        status: VOUCHER_STATUS_ACTIVED,
        year: null,
        month: null,
        owner: user.id
      }))
    ]

    expect(artistVouchers.length).to.equal(
      (await helpers.voucher.artistVouchers({ filter, user })).length
    )
  })

  it("update", async () => {
    const voucherUpdateInput = {
      month: 4
    }

    const voucher = await helpers.voucher.getOne({
      month: 3
    })

    const updateVoucher = await helpers.voucher.update({
      id: voucher.id,
      input: voucherUpdateInput
    })

    expect(updateVoucher).to.have.property("id")
    expect(updateVoucher.month).to.be.equal(4)
  })
})
