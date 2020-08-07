import { paginate } from "../utils"
import dataProvider from "../data-provider"
import helpers from "."

export default {
  ...dataProvider.storyNotification,
  storyNotifications: async ({ pageSize = 10, after, user }) => {
    const followings = user.following.map(item => item.target)
    const storyIds = (await helpers.story.getPublishedStory()).map(
      item => item.id
    )

    const results = await dataProvider.storyNotification
      .getByFilter({
        creator: { $in: followings },
        latestStory: { $in: storyIds }
      })
      .sort({
        updatedAt: "asc"
      })

    const storyNotifications = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      storyNotifications,
      cursor: storyNotifications.length
        ? storyNotifications[storyNotifications.length - 1].id
        : null,
      hasMore: storyNotifications.length
        ? storyNotifications[storyNotifications.length - 1].id !==
          results[results.length - 1].id
        : false
    }
  },
  readStoryNotification: async ({ id, user }) => {
    const currentStoryNotification = await dataProvider.storyNotification.getById(
      id
    )
    return currentStoryNotification.readUserList.includes(user.id)
      ? currentStoryNotification
      : dataProvider.storyNotification.update({
          id,
          user,
          input: {
            readUserList: [...currentStoryNotification.readUserList, user.id]
          }
        })
  }
}
