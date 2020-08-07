import {
  REALTIME_INFO,
  ONLINE_USER_SET,
  UNLOCK_CHAT_COUNT,
  FREE_STORY_COUNT,
  CONSUME_HISTORY_TYPE_UNLOCK_CHAT
} from "../constants"
import { pubsub } from "../utils"
import redisClient from "../redis/connection"
import dataProvider from "../data-provider"
import helpers from "."

const publish = async () => {
  pubsub.publish(REALTIME_INFO, {
    realtimeInfo: {
      onlineUserCount: (await redisClient.smembers(ONLINE_USER_SET)).length,
      unlockChatCount: await redisClient.get(UNLOCK_CHAT_COUNT),
      freeStoryCount: await redisClient.get(FREE_STORY_COUNT)
    }
  })
}

const addUserToRedisOnlineUserSet = async userId => {
  await redisClient.sadd(ONLINE_USER_SET, userId)
  await publish()
}

const removeUserToRedisOnlineUserSet = async userId => {
  await redisClient.srem(ONLINE_USER_SET, userId)
  await publish()
}

const checkUserIsOnline = async userId =>
  (await redisClient.smembers(ONLINE_USER_SET)).includes(userId)

const updateRealtimeInfoSchedule = async () => {
  const userIds = await redisClient.smembers(ONLINE_USER_SET)
  const unlockChats = await dataProvider.consumeHistory.getByFilter({
    creator: { $in: userIds },
    type: CONSUME_HISTORY_TYPE_UNLOCK_CHAT
  })
  const freeStories = helpers.story.getPublishedStory({ necessaryCoin: 0 })
  await redisClient.set(UNLOCK_CHAT_COUNT, unlockChats.length)
  await redisClient.set(FREE_STORY_COUNT, freeStories.length)
  await publish()
}

export default {
  addUserToRedisOnlineUserSet,
  removeUserToRedisOnlineUserSet,
  checkUserIsOnline,
  updateRealtimeInfoSchedule,
  publish
}
