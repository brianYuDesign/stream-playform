import { before } from "mocha"
import { expect } from "chai"
import { STORY_TAG_STORIES } from "../../src/constants"

import redisClient from "../../src/redis/connection"

import helpers from "../../src/helpers"

let mongoServer, user

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
})

describe("helpers-storyTags", async () => {
  it("searchStoryTags", async () => {
    const result = await redisClient.get(STORY_TAG_STORIES)
    const allStoryTags = result
      ? JSON.parse(result)
      : await helpers.storyTag.saveStoryTagStoriesInRedis()

    const results = results
      ? allStoryTags.filter(item => item.name.includes(filter.name))
      : allStoryTags
    const storyTags = await helpers.storyTag.searchStoryTags({
      pageSize: 10,
      results
    })
    expect(storyTags.totalCount).to.equal(23)
  })

  it("saveStoryTagStoriesInRedis", async () => {
    const storyTags = await helpers.storyTag.getAll()

    const stories = await helpers.story.getPublishedStory().sort({
      createdAt: "desc"
    })

    const storyTagStories = storyTags.map(storyTag => {
      return {
        ...storyTag,
        stories: stories.filter(story => story.storyTags.includes(storyTag.id))
      }
    })

    const results = storyTagStories.sort(
      (a, b) => b.stories.length - a.stories.length
    )
    await redisClient.set(STORY_TAG_STORIES, JSON.stringify(results))

    const saveStoryTagStoriesInRedis = await helpers.storyTag.saveStoryTagStoriesInRedis()
    expect(saveStoryTagStoriesInRedis.length).to.equal(23)
  })

  it("create", async () => {
    const storyTagsCreateInput = {
      name: "akin"
    }

    const newStoryTags = await helpers.storyTag.create({
      input: { ...storyTagsCreateInput, creator: user._id }
    })

    expect(newStoryTags).to.have.property("id")
  })

  it("update", async () => {
    const storyUpdateInput = {
      name: "fuck"
    }

    const storyTags = await helpers.storyTag.getOne({
      name: "akin"
    })

    const updateStoryTag = await helpers.storyTag.update({
      id: storyTags.id,
      input: storyUpdateInput,
      user
    })

    expect(updateStoryTag).to.have.property("id")
    expect(updateStoryTag.name).to.be.equal("fuck")
  })
})
