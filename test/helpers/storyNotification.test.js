import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, story, artist

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  artist = await helpers.user.getOne({ name: "bruno" })

  story = await helpers.story.create({
    input: {
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
  })
})

describe("helpers-storyNotification", async () => {
  it("storyNotifications", async () => {
    const followings = user.following.map(item => item.target)
    const storyIds = (await helpers.story.getPublishedStory()).map(
      item => item.id
    )

    const results = await helpers.storyNotification
      .getByFilter({
        creator: { $in: followings },
        latestStory: { $in: storyIds }
      })
      .sort({
        updatedAt: "asc"
      })
    const storyNotifications = await helpers.storyNotification.storyNotifications(
      {
        pageSize: 10,
        user
      }
    )

    expect(storyNotifications.totalCount).to.equal(0)
  })
  // it("readStoryNotification", async () => {
  //   const ID = artist.id
  //   const currentStoryNotification = await helpers.storyNotification.getById(
  //     artist.id
  //   )
  //   console.log(currentStoryNotification)

  //   const storyNotifications = await helpers.storyNotification.readStoryNotification(
  //     {
  //       ID,
  //       user
  //     }
  //   )
  //   console.log(storyNotifications)

  //   expect(storyNotifications.totalCount).to.equal(0)
  // })
})
