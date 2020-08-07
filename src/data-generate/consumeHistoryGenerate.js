import { v4 } from "uuid"
import helpers from "../helpers"
import {
  CONSUME_HISTORY_TYPE_UNLOCK_STORY,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN
} from "../constants"
import { getRandomObject } from "../utils"

export default async () => {
  const stories = await helpers.story.getPublishedStory()

  const users = await helpers.user.getByFilter({
    roleFeature: await helpers.roleFeature.getRoleClientId()
  })

  await users.forEach(async user => {
    try {
      let eachstories = stories
      const story1 = getRandomObject(eachstories)
      await helpers.consumeHistory.createConsumeHistory({
        user,
        input: {
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          coin: story1.necessaryCoin,
          story: story1.id,
          artist: story1.creator,
          timeStamp: v4()
        }
      })
      eachstories = eachstories.filter(item => item.id !== story1.id)

      const story2 = getRandomObject(eachstories)
      await helpers.consumeHistory.createConsumeHistory({
        user,
        input: {
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          coin: story2.necessaryCoin,
          story: story2.id,
          artist: story2.creator,
          timeStamp: v4()
        }
      })
      eachstories = eachstories.filter(item => item.id !== story2.id)

      const story3 = getRandomObject(eachstories)
      await helpers.consumeHistory.createConsumeHistory({
        user,
        input: {
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          coin: story3.necessaryCoin,
          story: story3.id,
          artist: story3.creator,
          timeStamp: v4()
        }
      })
      eachstories = eachstories.filter(item => item.id !== story3.id)

      const story4 = getRandomObject(eachstories)
      await helpers.consumeHistory.createConsumeHistory({
        user,
        input: {
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          coin: story4.necessaryCoin,
          story: story4.id,
          artist: story4.creator,
          timeStamp: v4()
        }
      })
      eachstories = eachstories.filter(item => item.id !== story4.id)

      const story5 = getRandomObject(eachstories)
      await helpers.consumeHistory.createConsumeHistory({
        user,
        input: {
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          coin: story5.necessaryCoin,
          story: story5.id,
          artist: story5.creator,
          timeStamp: v4()
        }
      })
      eachstories = eachstories.filter(item => item.id !== story5.id)
    } catch (error) {
      throw new Error(error)
    }
  })
}
