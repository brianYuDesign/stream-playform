import { before } from "mocha"
import { expect } from "chai"
import { FRONT_STORY_BLOCKS } from "../../src/constants"
import redisClient from "../../src/redis/connection"
import helpers from "../../src/helpers"

let user

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
})

describe("helpers-storyBlock", async () => {
  it("createStoryBlock", async () => {
    const storyBlockCreateInput = {
      isEnabled: true,
      name: "嘉義",
      enName: "Jiayi",
      parent: "5e4b7be3c88999092004b3df",
      order: 18
    }

    const newStoryBlock = await helpers.storyBlock.createStoryBlock({
      input: { ...storyBlockCreateInput, creator: user._id, updater: user._id }
    })

    expect(newStoryBlock).to.have.property("id")
  })

  it("updateStoryBlock", async () => {
    const storyUpdateInput = {
      name: "嘉義水上"
    }

    const storyBlock = await helpers.storyBlock.getOne({
      name: "嘉義"
    })

    const updateStory = await helpers.storyBlock.updateStoryBlock({
      id: storyBlock.id,
      input: storyUpdateInput,
      user
    })

    expect(updateStory).to.have.property("id")
    expect(updateStory.name).to.be.equal("嘉義水上")
  })

  it("storyBlock", async () => {
    const storyBlockId = await helpers.storyBlock.getOne({ name: "南區" })
    const result = (await redisClient.get(storyBlockId.id))
      ? JSON.parse(result)
      : await helpers.storyBlock.saveStoryBlockInRedis(storyBlockId.id)

    const storyBlock = await helpers.storyBlock.storyBlock(storyBlockId.id)
    expect(storyBlock.stories.length).to.equal(13)
  })

  it("saveFrontStoryBlocksInRedis", async () => {
    const results = await helpers.storyBlock.getByFilter({
      parent: null,
      isEnabled: true
    })

    const storyBlock = await helpers.storyBlock.saveFrontStoryBlocksInRedis()
    expect(storyBlock.length).to.equal(8)
  })
})
