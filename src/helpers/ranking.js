import dataProvider from "../data-provider"
import {
  ONEDAY,
  ONEMONTH,
  ONEWEEK,
  ALL,
  UNLOCK_STORY,
  UNLOCK_CHAT,
  SEND_TOY,
  ALL_RANK_ONEMONTH_CLIENT,
  UNLOCK_STORY_RANK_ONEMONTH_CLIENT,
  UNLOCK_CHAT_RANK_ONEMONTH_CLIENT,
  SEND_TOY_RANK_ONEMONTH_CLIENT,
  ALL_RANK_ONEWEEK_CLIENT,
  UNLOCK_STORY_RANK_ONEWEEK_CLIENT,
  UNLOCK_CHAT_RANK_ONEWEEK_CLIENT,
  SEND_TOY_RANK_ONEWEEK_CLIENT,
  ALL_RANK_ONEDAY_CLIENT,
  UNLOCK_STORY_RANK_ONEDAY_CLIENT,
  UNLOCK_CHAT_RANK_ONEDAY_CLIENT,
  SEND_TOY_RANK_ONEDAY_CLIENT,
  ALL_RANK_ONEMONTH_ARTIST,
  UNLOCK_STORY_RANK_ONEMONTH_ARTIST,
  UNLOCK_CHAT_RANK_ONEMONTH_ARTIST,
  SEND_TOY_RANK_ONEMONTH_ARTIST,
  ALL_RANK_ONEWEEK_ARTIST,
  UNLOCK_STORY_RANK_ONEWEEK_ARTIST,
  UNLOCK_CHAT_RANK_ONEWEEK_ARTIST,
  SEND_TOY_RANK_ONEWEEK_ARTIST,
  ALL_RANK_ONEDAY_ARTIST,
  UNLOCK_STORY_RANK_ONEDAY_ARTIST,
  UNLOCK_CHAT_RANK_ONEDAY_ARTIST,
  SEND_TOY_RANK_ONEDAY_ARTIST
} from "../constants"
import redisClient from "../redis/connection"
import { timeMap, stringCompare } from "../utils"

// 取得redis排行榜前三名是否有此user
const getUserBadge = async (type, period, userId) => {
  const userList = JSON.parse(
    await redisClient.get(`${type}_RANK_${period}_ARTIST`)
  )
  if (userList.length === 0) {
    return undefined
  }

  const user = userList.find(
    item => [1, 2, 3].includes(item.rank) && stringCompare(item.user, userId)
  )
  return user ? { rank: user.rank, type, period } : undefined
}

// 取得主播排行榜標籤
const getUserBadges = async userId => {
  const badges = [
    await getUserBadge(ALL, ONEMONTH, userId),
    await getUserBadge(UNLOCK_STORY, ONEMONTH, userId),
    await getUserBadge(UNLOCK_CHAT, ONEMONTH, userId),
    await getUserBadge(SEND_TOY, ONEMONTH, userId),
    await getUserBadge(ALL, ONEWEEK, userId),
    await getUserBadge(UNLOCK_STORY, ONEWEEK, userId),
    await getUserBadge(UNLOCK_CHAT, ONEWEEK, userId),
    await getUserBadge(SEND_TOY, ONEWEEK, userId),
    await getUserBadge(ALL, ONEDAY, userId),
    await getUserBadge(UNLOCK_STORY, ONEDAY, userId),
    await getUserBadge(UNLOCK_CHAT, ONEDAY, userId),
    await getUserBadge(SEND_TOY, ONEDAY, userId)
  ]

  return badges.filter(item => item)
}

const getUserRankList = async ({ type, period, isClient }) => {
  const consumeHistories = await dataProvider.consumeHistory.getByFilter({
    type: {
      $in: type === "ALL" ? [UNLOCK_CHAT, UNLOCK_STORY, SEND_TOY] : [type]
    },
    createdAt: { $gte: timeMap.get(period) }
  })

  if (consumeHistories.length === 0) {
    return []
  }

  const artistRankMap = new Map()
  consumeHistories.forEach(item => {
    if (!artistRankMap.has(String(isClient ? item.creator : item.artist))) {
      const tmpArr = [item]
      artistRankMap.set(String(isClient ? item.creator : item.artist), tmpArr)
    } else {
      const addArr = artistRankMap.get(
        String(isClient ? item.creator : item.artist)
      )
      addArr.push(item)
      artistRankMap.set(String(isClient ? item.creator : item.artist), addArr)
    }
  })

  const sortedUserRankMap = new Map(
    [...artistRankMap.entries()].sort((a, b) => b[1].length - a[1].length)
  )

  const results = []
  sortedUserRankMap.forEach((value, key) => {
    results.push({
      user: key,
      rank: results.length + 1,
      coin: value.reduce((prev, current) => prev + current.coin, 0),
      quantity: value.length
    })
  })

  return results
}

const updateDayRankSchedule = async () => {
  const dayOfClientAllRank = await getUserRankList({
    type: ALL,
    period: ONEDAY,
    isClient: true
  })

  const dayOfArtistAllRank = await getUserRankList({
    type: ALL,
    period: ONEDAY,
    isClient: false
  })

  const dayOfClientUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEDAY,
    isClient: true
  })

  const dayOfArtistUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEDAY,
    isClient: false
  })

  const dayOfClientChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEDAY,
    isClient: true
  })

  const dayOfArtistChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEDAY,
    isClient: false
  })

  const dayOfClientSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEDAY,
    isClient: true
  })

  const dayOfArtistSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEDAY,
    isClient: false
  })

  await redisClient.set(
    ALL_RANK_ONEDAY_CLIENT,
    JSON.stringify(dayOfClientAllRank)
  )
  await redisClient.set(
    ALL_RANK_ONEDAY_ARTIST,
    JSON.stringify(dayOfArtistAllRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEDAY_CLIENT,
    JSON.stringify(dayOfClientUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEDAY_ARTIST,
    JSON.stringify(dayOfArtistUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEDAY_CLIENT,
    JSON.stringify(dayOfClientChatRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEDAY_ARTIST,
    JSON.stringify(dayOfArtistChatRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEDAY_CLIENT,
    JSON.stringify(dayOfClientSendToyRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEDAY_ARTIST,
    JSON.stringify(dayOfArtistSendToyRank)
  )
}

const updateWeekAndMonthRankSchedule = async () => {
  const weekOfClientAllRank = await getUserRankList({
    type: ALL,
    period: ONEWEEK,
    isClient: true
  })
  const weekOfArtistAllRank = await getUserRankList({
    type: ALL,
    period: ONEWEEK,
    isClient: false
  })
  const weekOfClientUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEWEEK,
    isClient: true
  })
  const weekOfArtistUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEWEEK,
    isClient: false
  })
  const weekOfClientChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEWEEK,
    isClient: true
  })
  const weekOfArtistChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEWEEK,
    isClient: false
  })
  const weekOfClientSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEWEEK,
    isClient: true
  })
  const weekOfArtistSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEWEEK,
    isClient: false
  })

  const monthOfClientAllRank = await getUserRankList({
    type: ALL,
    period: ONEMONTH,
    isClient: true
  })
  const monthOfArtistAllRank = await getUserRankList({
    type: ALL,
    period: ONEMONTH,
    isClient: false
  })

  const monthOfClientUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEMONTH,
    isClient: true
  })

  const monthOfArtistUnlockStoryRank = await getUserRankList({
    type: UNLOCK_STORY,
    period: ONEMONTH,
    isClient: false
  })
  const monthOfClientChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEMONTH,
    isClient: true
  })

  const monthOfArtistChatRank = await getUserRankList({
    type: UNLOCK_CHAT,
    period: ONEMONTH,
    isClient: false
  })
  const monthOfClientSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEMONTH,
    isClient: true
  })

  const monthOfArtistSendToyRank = await getUserRankList({
    type: SEND_TOY,
    period: ONEMONTH,
    isClient: false
  })

  await redisClient.set(
    ALL_RANK_ONEWEEK_CLIENT,
    JSON.stringify(weekOfClientAllRank)
  )
  await redisClient.set(
    ALL_RANK_ONEWEEK_ARTIST,
    JSON.stringify(weekOfArtistAllRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEWEEK_CLIENT,
    JSON.stringify(weekOfClientUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEWEEK_ARTIST,
    JSON.stringify(weekOfArtistUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEWEEK_CLIENT,
    JSON.stringify(weekOfClientSendToyRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEWEEK_ARTIST,
    JSON.stringify(weekOfArtistSendToyRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEWEEK_CLIENT,
    JSON.stringify(weekOfClientChatRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEWEEK_ARTIST,
    JSON.stringify(weekOfArtistChatRank)
  )
  await redisClient.set(
    ALL_RANK_ONEMONTH_CLIENT,
    JSON.stringify(monthOfClientAllRank)
  )
  await redisClient.set(
    ALL_RANK_ONEMONTH_ARTIST,
    JSON.stringify(monthOfArtistAllRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEMONTH_CLIENT,
    JSON.stringify(monthOfClientUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_STORY_RANK_ONEMONTH_ARTIST,
    JSON.stringify(monthOfArtistUnlockStoryRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEMONTH_CLIENT,
    JSON.stringify(monthOfClientSendToyRank)
  )
  await redisClient.set(
    UNLOCK_CHAT_RANK_ONEMONTH_ARTIST,
    JSON.stringify(monthOfArtistSendToyRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEMONTH_CLIENT,
    JSON.stringify(monthOfClientChatRank)
  )
  await redisClient.set(
    SEND_TOY_RANK_ONEMONTH_ARTIST,
    JSON.stringify(monthOfArtistChatRank)
  )
}
const getRankingByTypeAndPeriod = async ({ type, period, isClient }) => {
  const userType = isClient ? "CLIENT" : "ARTIST"
  const results = await redisClient.get(`${type}_RANK_${period}_${userType}`)

  const userList = results
    ? JSON.parse(results)
    : await getUserRankList({ type, period, isClient })

  return userList
}

export default {
  getUserBadges,
  updateDayRankSchedule,
  updateWeekAndMonthRankSchedule,
  getRankingByTypeAndPeriod
}
