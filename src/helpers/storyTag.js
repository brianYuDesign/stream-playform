import { paginate } from "../utils"
import dataProvider from "../data-provider"
import redisClient from "../redis/connection"
import { STORY_TAG_STORIES } from "../constants"
import helpers from "."

export default {
  ...dataProvider.storyTag,
  async searchStoryTags({ filter, pageSize = 10, after }) {
    try {
      const result = await redisClient.get(STORY_TAG_STORIES)
      const allStoryTags = result
        ? JSON.parse(result)
        : await this.saveStoryTagStoriesInRedis()

      const results = filter
        ? allStoryTags.filter(item => item.name.includes(filter.name))
        : allStoryTags

      const storyTags = paginate({
        after,
        pageSize,
        results
      })
      return {
        totalCount: results.length,
        storyTags,
        cursor: storyTags.length ? storyTags[storyTags.length - 1].id : null,
        hasMore: storyTags.length
          ? storyTags[storyTags.length - 1].id !==
            results[results.length - 1].id
          : false
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  async saveStoryTagStoriesInRedis() {
    try {
      const storyTags = await dataProvider.storyTag.getAll()

      const stories = await helpers.story.getPublishedStory().sort({
        createdAt: "desc"
      })

      const storyTagStories = storyTags.map(storyTag => {
        return {
          ...storyTag,
          stories: stories.filter(story =>
            story.storyTags.includes(storyTag.id)
          )
        }
      })

      const results = storyTagStories.sort(
        (a, b) => b.stories.length - a.stories.length
      )
      await redisClient.set(STORY_TAG_STORIES, JSON.stringify(results))
      return results
    } catch (error) {
      throw new Error(error)
    }
  }
}
