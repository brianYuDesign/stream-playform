import { UserInputError } from "apollo-server-express"
import _ from "lodash"
import env from "dotenv"
import dataProvider from "../data-provider"
import {
  CONSUME_HISTORY_TYPE_SEND_TOY,
  CONSUME_HISTORY_TYPE_UNLOCK_STORY,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
  VOUCHER_STATUS_USED,
  CHATMESSAGE_TYPE_STICKER,
  RECORD_TYPE_CONSUME,
  CONSUME_HISTORY_TYPE_UNLOCK_CHAT,
  CHATMESSAGE_TYPE_TEXT,
  CONSUME_HISTORY_TYPE_SUBSCRIBE,
  ALL,
  REDIS_SUBSCRIBEING_COIN
} from "../constants"
import { stringCompare, paginate, timeMap } from "../utils"
import redisClient from "../redis/connection"
import helpers from "."

env.config()
const { SUBSCRIBEING_COIN } = process.env

export default {
  ...dataProvider.consumeHistory,
  consumeHistories: async ({ pageSize = 10, pageNumber, filter }) => {
    const results = await dataProvider.consumeHistory.paginate(
      {
        ...(filter &&
          filter.exchangeType &&
          filter.exchangeType !== ALL && {
            exchangeType: filter.exchangeType
          }),
        ...(filter &&
          filter.type &&
          filter.type !== ALL && {
            type: filter.type
          }),
        ...(filter &&
          filter.creator && {
            creator: filter.creator
          }),
        ...(filter &&
          filter.dealer && {
            dealer: filter.dealer
          }),
        ...(filter &&
          filter.artist && {
            artist: filter.artist
          }),
        ...(filter &&
          filter.year &&
          filter.month && {
            createdAt: {
              $gte: new Date(filter.year, filter.month - 1, 1, 0, 0, 0),
              $lte: new Date(filter.year, filter.month, 1, 0, 0, 0)
            }
          }),
        ...(filter &&
          filter.period && {
            createdAt: { $gte: timeMap.get(filter.period) }
          })
      },
      { pageSize, pageNumber, sort: { createdAt: "-1" } }
    )
    return {
      totalPage: results.totalPages,
      consumeHistories: results.docs
    }
  },
  async createCoinConsumeHistory({ input, necessaryCoin, user }, cb) {
    if (stringCompare(input.artist, user.id)) {
      throw new UserInputError("無法消耗，操作有誤")
    }

    if (necessaryCoin > user.coin) {
      throw new Error("您的寶石不足")
    } else {
      const consumeHistory = await dataProvider.consumeHistory.create({
        input: {
          coin: necessaryCoin,
          dealer: (await helpers.user.getById(input.artist)).dealer,
          ..._.omit(input, ["content", "timeStamp"]),
          userTimeStamp: user.id + input.timeStamp
        },
        user
      })
      await cb()
      await helpers.record.convertArgToRecord(
        { consumeHistory: consumeHistory.id },
        RECORD_TYPE_CONSUME,
        -consumeHistory.coin,
        user,
        input.artist
      )
      return consumeHistory
    }
  },
  async createVoucherConsumeHistory({ input, user }, cb) {
    if (!input.voucher) throw new UserInputError("require input.voucher")

    const voucher = await dataProvider.voucher.getById(input.voucher)

    if (!voucher) {
      throw new UserInputError("this voucher can not used")
    }

    await dataProvider.voucher.update({
      id: voucher.id,
      user,
      input: {
        status: VOUCHER_STATUS_USED
      }
    })
    const consumeHistory = await dataProvider.consumeHistory.create({
      input: {
        dealer: (await helpers.user.getById(input.artist)).dealer,
        ..._.omit(input, ["content", "timeStamp"]),
        userTimeStamp: user.id + input.timeStamp
      },
      user
    })

    await cb()
    return consumeHistory
  },
  async validateFactory({ input, field, provider }) {
    if (!input[field]) throw new UserInputError(`require input.${field}`)
    const result = await provider.getById(input[field])
    if (result === null) throw new UserInputError(`input.${field} is not exist`)
    return result
  },
  async createConsumeHistory({ input, user }) {
    let necessaryCoin

    const isConsumeHistoryExist = await dataProvider.consumeHistory.getOne({
      userTimeStamp: user.id + input.timeStamp
    })

    if (isConsumeHistoryExist) {
      throw new UserInputError("you are already create consumeHistory")
    }

    if (input.type === CONSUME_HISTORY_TYPE_SUBSCRIBE) {
      necessaryCoin = Number(
        (await redisClient.get(REDIS_SUBSCRIBEING_COIN)) || SUBSCRIBEING_COIN
      )
    } else if (input.type === CONSUME_HISTORY_TYPE_UNLOCK_STORY) {
      necessaryCoin = (
        await this.validateFactory({
          input,
          field: "story",
          provider: dataProvider.story
        })
      ).necessaryCoin

      if (
        await dataProvider.consumeHistory.getOne({
          story: input.story,
          creator: user.id
        })
      ) {
        throw new UserInputError("yor are already buy this story")
      }
    } else if (input.type === CONSUME_HISTORY_TYPE_SEND_TOY) {
      necessaryCoin = (
        await this.validateFactory({
          input,
          field: "toy",
          provider: dataProvider.toy
        })
      ).necessaryCoin
    } else {
      const participant = (
        await this.validateFactory({
          input,
          field: "chatroom",
          provider: dataProvider.chatroom
        })
      ).participants.find(item => stringCompare(item.user, user.id))

      if (!participant) {
        throw new UserInputError("系統錯誤，請洽管理員")
      }
      necessaryCoin = participant.replyCoin
    }

    if (user.coin < necessaryCoin) {
      throw new Error("您的寶石不足，無法購買")
    }

    const cb = async () => this.chatmessageCreate({ input, user })

    return input.exchangeType === CONSUME_HISTORY_EXCHANGE_TYPE_COIN
      ? this.createCoinConsumeHistory({ input, user, necessaryCoin }, cb)
      : this.createVoucherConsumeHistory({ input, user }, cb)
  },
  chatmessageCreate: async ({ input, user }) => {
    if (
      input.type === CONSUME_HISTORY_TYPE_SEND_TOY ||
      input.type === CONSUME_HISTORY_TYPE_UNLOCK_CHAT
    ) {
      return helpers.chatmessage.createChatmessage({
        input: {
          type:
            input.type === CONSUME_HISTORY_TYPE_SEND_TOY
              ? CHATMESSAGE_TYPE_STICKER
              : CHATMESSAGE_TYPE_TEXT,
          chatroom: input.chatroom,
          content:
            input.type === CONSUME_HISTORY_TYPE_SEND_TOY
              ? (await dataProvider.toy.getById(input.toy)).photoUrl
              : input.content
        },
        user
      })
    }
    return null
  },
  archives: async ({ pageSize = 10, after, user }) => {
    const cosumeHistories = await dataProvider.consumeHistory
      .getByFilter({
        creator: user.id,
        type: CONSUME_HISTORY_TYPE_UNLOCK_STORY
      })
      .sort({
        createdAt: "desc"
      })

    const artistStoryMap = new Map()

    cosumeHistories.forEach(item => {
      if (!artistStoryMap.has(String(item.artist))) {
        artistStoryMap.set(String(item.artist), [item.story])
      } else {
        artistStoryMap.set(String(item.artist), [
          ...artistStoryMap.get(String(item.artist)),
          item.story
        ])
      }
    })

    const results = []

    artistStoryMap.forEach((value, key) => {
      results.push({ artist: key, stories: value })
    })

    const archives = paginate({
      after,
      pageSize,
      results,
      getCursor: item => item.artist
    })
    return {
      totalCount: results.length,
      archives,
      cursor: archives.length ? archives[archives.length - 1].artist : null,
      hasMore: archives.length
        ? archives[archives.length - 1].artist !==
          results[results.length - 1].artist
        : false
    }
  },
  archive: async ({ artist, user }) => {
    const cosumeHistories = await dataProvider.consumeHistory
      .getByFilter({
        creator: user.id,
        artist,
        type: CONSUME_HISTORY_TYPE_UNLOCK_STORY
      })
      .sort({
        createdAt: "desc"
      })

    return {
      stories: cosumeHistories.map(item => item.story),
      artist
    }
  }
}
