import env from "dotenv"
import redisClient from "../redis/connection"
import {
  REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT,
  REDIS_SUBSCRIBEING_COIN,
  REDIS_CHAT_COIN,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
  REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
  REDIS_PINNED_STORY_LENGTH
} from "../constants"
import helpers from "."

env.config()
const {
  FOLLOWING_REWARD_OF_UNLOCK_CHAT,
  SUBSCRIBEING_COIN,
  CHAT_COIN,
  SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
  SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
  PINNED_STORY_LENGTH
} = process.env

// 檢查redis是否預設值，沒有的就修改redis預設值

export default {
  setEnvConfiguration: async () => {
    if (!(await redisClient.get(REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT))) {
      await redisClient.set(
        REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT,
        FOLLOWING_REWARD_OF_UNLOCK_CHAT
      )
    }

    if (!(await redisClient.get(REDIS_SUBSCRIBEING_COIN))) {
      await redisClient.set(REDIS_SUBSCRIBEING_COIN, SUBSCRIBEING_COIN)
    }

    if (!(await redisClient.get(REDIS_CHAT_COIN))) {
      await redisClient.set(REDIS_CHAT_COIN, CHAT_COIN)
    }

    if (!(await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY))) {
      await redisClient.set(
        REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
        SUBSCRIBING_REWARD_OF_UNLOCK_STORY
      )
    }

    if (!(await redisClient.get(REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT))) {
      await redisClient.set(
        REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
        SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
      )
    }

    if (!(await redisClient.get(REDIS_PINNED_STORY_LENGTH))) {
      await redisClient.set(REDIS_PINNED_STORY_LENGTH, PINNED_STORY_LENGTH)
    }
  },
  getConfiguration: () => ({
    followingRewardOfUnlockChat: redisClient.get(
      REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT
    ),
    subscribeingCoin: redisClient.get(REDIS_SUBSCRIBEING_COIN),
    chatCoin: redisClient.get(REDIS_CHAT_COIN),
    subscribingRewardOfUnlockStory: redisClient.get(
      REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY
    ),
    subscribingRewardOfUnlockChat: redisClient.get(
      REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT
    ),
    pinnedStoryLength: redisClient.get(REDIS_PINNED_STORY_LENGTH)
  }),
  async updateConfiguration({
    followingRewardOfUnlockChat,
    subscribeingCoin,
    chatCoin,
    subscribingRewardOfUnlockStory,
    subscribingRewardOfUnlockChat,
    pinnedStoryLength
  }) {
    await redisClient.set(
      REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT,
      followingRewardOfUnlockChat
    )
    await redisClient.set(REDIS_SUBSCRIBEING_COIN, subscribeingCoin)

    if (Number(await redisClient.get(REDIS_CHAT_COIN)) !== Number(chatCoin)) {
      await redisClient.set(REDIS_CHAT_COIN, chatCoin)
      const chatrooms = await helpers.chatroom.getAll()
      const chatroomParticipantIds = chatrooms.map(
        chatroom => chatroom.participants.find(item => item.replyCoin !== 0)._id
      )

      await helpers.chatroom.updateMany({
        filter: { "participants._id": { $in: chatroomParticipantIds } },
        input: { "participants.$.replyCoin": chatCoin }
      })
    }
    await redisClient.set(
      REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_STORY,
      subscribingRewardOfUnlockStory
    )
    await redisClient.set(
      REDIS_SUBSCRIBING_REWARD_OF_UNLOCK_CHAT,
      subscribingRewardOfUnlockChat
    )
    await redisClient.set(REDIS_PINNED_STORY_LENGTH, pinnedStoryLength)
    return this.getConfiguration()
  }
}
