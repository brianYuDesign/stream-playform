import {
  CONSUME_HISTORY_TYPE_MAP,
  CONSUME_HISTORY_TYPE_SEND_TOY,
  CONSUME_HISTORY_TYPE_UNLOCK_CHAT,
  CONSUME_HISTORY_TYPE_UNLOCK_STORY,
  CONSUME_HISTORY_TYPE_SUBSCRIBE,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN
} from "../constants"
import { stringCompare } from "../utils"
import helpers from "."

export default {
  dealerReports: async ({ pageSize = 10, pageNumber, filter }) => {
    const consumeHistories = await helpers.consumeHistory.getByFilter({
      exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
      ...(filter &&
        filter.dealer && {
          dealer: filter.dealer
        }),
      ...(filter &&
        filter.year &&
        filter.month && {
          createdAt: {
            $gte: new Date(filter.year, filter.month - 1, 1, 0, 0, 0),
            $lte: new Date(filter.year, filter.month, 1, 0, 0, 0)
          }
        })
    })

    const artistSet = new Set(consumeHistories.map(item => item.artist))
    const results = await helpers.user.paginate(
      { _id: { $in: Array.from(artistSet) } },
      { pageSize, pageNumber }
    )

    const dealerReports = results.docs.map(artist => ({
      artist,
      sendToyCoin: consumeHistories
        .filter(
          item =>
            stringCompare(item.artist, artist.id) &&
            item.type === CONSUME_HISTORY_TYPE_SEND_TOY
        )
        .reduce((prev, current) => prev + current.coin, 0),
      unlockChatCoin: consumeHistories
        .filter(
          item =>
            stringCompare(item.artist, artist.id) &&
            item.type === CONSUME_HISTORY_TYPE_UNLOCK_CHAT
        )
        .reduce((prev, current) => prev + current.coin, 0),
      unlockStoryCoin: consumeHistories
        .filter(
          item =>
            stringCompare(item.artist, artist.id) &&
            item.type === CONSUME_HISTORY_TYPE_UNLOCK_STORY
        )
        .reduce((prev, current) => prev + current.coin, 0),
      subscribeCoin: consumeHistories
        .filter(
          item =>
            stringCompare(item.artist, artist.id) &&
            item.type === CONSUME_HISTORY_TYPE_SUBSCRIBE
        )
        .reduce((prev, current) => prev + current.coin, 0),
      totalCoin: consumeHistories
        .filter(item => stringCompare(item.artist, artist.id))
        .reduce((prev, current) => prev + current.coin, 0)
    }))

    return {
      totalPage: results.totalPages,
      dealerReports,
      totalIncome: consumeHistories.reduce(
        (prev, current) => prev + current.coin,
        0
      )
    }
  },
  generateDelearReportsCsvResult: ({ dealerReports, totalIncome, dealer }) => {
    const firstLine = ["經銷商", dealer.name, "單月總收益", totalIncome]
    const secondLine = [
      "主播",
      "收禮統計",
      "聊天統計",
      "解鎖統計",
      "訂閱統計",
      "總計"
    ]

    const result = [firstLine, secondLine]

    dealerReports.forEach(item => {
      result.push([
        item.artist.uid,
        item.sendToyCoin,
        item.unlockChatCoin,
        item.unlockStoryCoin,
        item.subscribeCoin,
        item.totalCoin
      ])
    })
    return result
  },
  generateArtistReportCsvResult: ({ consumeHistories, artist }) => {
    const firstLine = [
      "主播",
      artist.uid,
      "單月總收益",
      consumeHistories.reduce((prev, current) => prev + current.coin, 0)
    ]
    const secondLine = ["日期", "類型", "coin"]

    const result = [firstLine, secondLine]

    consumeHistories.forEach(item => {
      result.push([
        item.createdAt,
        CONSUME_HISTORY_TYPE_MAP[item.type],
        item.coin
      ])
    })
    return result
  }
}
