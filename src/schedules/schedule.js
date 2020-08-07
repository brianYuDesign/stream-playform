import schedule from "node-schedule"
import helpers from "../helpers"

// 更新當日排行榜(1小時)
const updateDayRankScheduleRule = new schedule.RecurrenceRule()
updateDayRankScheduleRule.minute = 0
schedule.scheduleJob(
  updateDayRankScheduleRule,
  helpers.ranking.updateDayRankSchedule
)

// 更新當週與當月排行榜(1日)
const updateWeekAndMonthRankScheduleRule = new schedule.RecurrenceRule()
updateWeekAndMonthRankScheduleRule.hour = 12
schedule.scheduleJob(
  updateWeekAndMonthRankScheduleRule,
  helpers.ranking.updateWeekAndMonthRankSchedule
)

// 更新首頁即時資訊(3秒)
// schedule.scheduleJob(
//   "0-59/3 * * * * *",
//   helpers.realtime.updateRealtimeInfoSchedule
// )

// 更新貼文標籤貼文
const saveStoryTagStoriesInRedisRule = new schedule.RecurrenceRule()
saveStoryTagStoriesInRedisRule.minute = 0
schedule.scheduleJob(
  saveStoryTagStoriesInRedisRule,
  helpers.storyTag.saveStoryTagStoriesInRedis
)

// 更新貼文區塊以及貼文
const saveFrontStoryBlocksInRedisRule = new schedule.RecurrenceRule()
saveFrontStoryBlocksInRedisRule.second = 0
schedule.scheduleJob(
  saveFrontStoryBlocksInRedisRule,
  helpers.storyBlock.saveFrontStoryBlocksInRedis
)

const saveStoryBlocksInRedisRule = new schedule.RecurrenceRule()
saveStoryBlocksInRedisRule.second = 10
schedule.scheduleJob(saveStoryBlocksInRedisRule, async () => {
  const frontStoryBlocks = await helpers.storyBlock.frontStoryBlocks()
  frontStoryBlocks.forEach(item =>
    helpers.storyBlock.saveStoryBlockInRedis(item.id)
  )
})

const createSubscriptionArtistScheduleRule = new schedule.RecurrenceRule()
createSubscriptionArtistScheduleRule.date = 1
schedule.scheduleJob(
  createSubscriptionArtistScheduleRule,
  helpers.subscribe.createSubscriptionArtistSchedule
)
