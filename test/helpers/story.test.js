import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"
import { stringCompare, paginate } from "../../src/utils"
import {
  STORY_STATUS_PUBLISHED,
  REDIS_PINNED_STORY_LENGTH,
  PINNED_STORY_LENGTH
} from "../../src/constants"
import redisClient from "../../src/redis/connection"

let user, storyTag

before(async () => {
  user = await helpers.user.getOne({ name: "brianBack" })
  storyTag = await helpers.dealer.create({
    input: { name: "akin" }
  })
})

describe("helpers-story", async () => {
  it("getPublishedStory", async () => {
    const getPublishedStory = await helpers.story.getByFilter({
      status: STORY_STATUS_PUBLISHED,
      publishTime: { $lt: new Date() },
      endTime: { $gt: new Date() }
    })

    expect(getPublishedStory.length).to.equal(
      (await helpers.story.getPublishedStory()).length
    )
  })

  it("pinnedStories", async () => {
    const story = await helpers.story.pinnedStories({})

    expect(story[0].content).to.be.a("string")
  })

  it("freeStories", async () => {
    const results = await helpers.story
      .getPublishedStory({ necessaryCoin: 0 })
      .sort({
        publishTime: "desc"
      })

    // const stories = await helpers.story.freeStories({ pageSize: 10, results })
    // console.log(stories)

    expect(results.length).to.equal(0)
  })

  it("searchStories", async () => {
    const results = results
      ? await helpers.story
          .getPublishedStory({
            content: { $regex: filter.content, $options: "i" }
          })
          .sort({
            publishTime: "desc"
          })
      : await helpers.story.getPublishedStory().sort({
          publishTime: "desc"
        })
    const searchStories = await helpers.story.searchStories({
      pageSize: 10,
      results
    })

    expect(searchStories.totalCount).to.equal(13)
  })

  it("artistStories", async () => {
    let user = await helpers.user.getOne({ name: "bruno" })
    const results = results
      ? await helpers.story.getPublishedStory({ creator: user.id }).sort({
          createdAt: "desc"
        })
      : await helpers.story
          .getByFilter({ creator: user.id })
          .sort({ createdAt: "desc" })
    const artistStories = await helpers.story.artistStories({
      pageSize: 10,
      results,
      user
    })

    expect(artistStories.totalCount).to.equal(0)
  })

  it("storyTagStories", async () => {
    const storyTag = await helpers.storyTag.getOne({ name: "偷情" })
    const results = await helpers.story
      .getPublishedStory({ storyTags: storyTag })
      .sort({
        publishTime: "desc"
      })
    const storyTagStories = await helpers.story.storyTagStories({
      pageSize: 10,
      results
    })

    expect(storyTagStories.totalCount).to.equal(0)
  })

  it("storyBlockStories", async () => {
    const storyBlock = await helpers.storyBlock.getOne({ name: "北區" })
    const results = await helpers.storyBlock.storyBlock(storyBlock)
    const result = await helpers.story.storyBlockStories({
      results,
      pageSize: 10
    })
    expect(result.totalCount).to.equal(13)
  })

  it("frontStories", async () => {
    const results = await helpers.story.getPublishedStory().sort({
      publishTime: "desc"
    })

    const result = await helpers.story.frontStories({
      results,
      pageSize: 10
    })
    expect(result.totalCount).to.equal(13)
  })

  it("ownStories", async () => {
    let user = await helpers.user.getOne({ name: "bruno" })

    const result = await helpers.story.ownStories({
      user,
      pageSize: 10
    })

    expect(result.totalCount).to.equal(13)
  })

  it("stories", async () => {
    const result = await helpers.story.stories({
      pageSize: 10
    })
    expect(result.totalPage).to.equal(2)
  })

  it("replacePinnedStory", async () => {
    const result = await helpers.story.updateMany({
      filter: { isPinned: true },
      input: { isPinned: false }
    })
    expect(result.nModified).to.equal(1)
  })

  it("isNumberValueExist", async () => {
    const result = await helpers.story.getOne({ number: "ctuj0v" })
    expect(result.number).to.equal("ctuj0v")
  })
  // it("newPublishedStoryOfFollowArtistSubscibeFilter", async () => {
  //   const result = await helpers.story.getOne({ number: "ctuj0v" })
  //   expect(result.number).to.equal("ctuj0v")
  // })
  // it("getNextStory", async () => {
  //   const result = await helpers.story
  //     .getByFilter({
  //       necessaryCoin: 240,
  //       status: STORY_STATUS_PUBLISHED,
  //       // publishTime: { $lt: story.publishTime },
  //       endTime: { $gte: new Date() }
  //     })
  //     .sort({
  //       publishTime: "desc"
  //     })
  //   console.log(result)
  //   // expect(result.number).to.equal("ctuj0v")
  // })

  it("getPurchaseStatus", async () => {
    user = await helpers.user.getOne({ name: "brianFront" })
    const story = await helpers.story.getOne({ number: "hc7pq9" })
    const consumeHistory = await helpers.consumeHistory.getOne({
      creator: user.id,
      story: story.id
    })
    const getPurchaseStatus = await helpers.story.getPurchaseStatus({
      story,
      user
    })
    expect(getPurchaseStatus).to.be.false
  })

  // it("getResourceUrl", async () => {
  //   user = await helpers.user.getOne({ name: "brianFront" })
  //   const story = await helpers.story.getOne({ number: "hc7pq9" })
  //   const consumeHistory = await helpers.consumeHistory.getOne({
  //     creator: user.id,
  //     story: story.id
  //   })
  //   const getPurchaseStatus = await helpers.story.getResourceUrl({
  //     story,
  //     user
  //   })

  //   expect(getPurchaseStatus).to.not.be.null
  // })

  it("createStory", async () => {
    const storyCreateInput = {
      status: "PUBLISHED",
      isPinned: false,
      type: "VIDEO",
      content: "瘦版文豪",
      necessaryCoin: 0,
      number: "60jdsz",
      endTime: "2020-03-27T00:00:00.000+08:00",
      publishTime: "2020-03-13T00:00:00.000+08:00",
      fakeViews: 500
    }

    const newStory = await helpers.story.createStory({
      input: { ...storyCreateInput, storyTag: storyTag._id, creator: user._id }
    })

    expect(newStory).to.have.property("id")
  })

  it("updateStory", async () => {
    const storyUpdateInput = {
      content: "瘦版brian"
    }

    const story = await helpers.story.getOne({
      content: "瘦版文豪"
    })

    const updateStory = await helpers.story.updateStory({
      id: story.id,
      input: storyUpdateInput
    })

    expect(updateStory).to.have.property("id")
    expect(updateStory.content).to.be.equal("瘦版brian")
  })
})
