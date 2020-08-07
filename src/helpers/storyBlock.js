import dataProvider from "../data-provider"
import redisClient from "../redis/connection"
import { FRONT_STORY_BLOCKS } from "../constants"
import { stringCompare } from "../utils"
import helpers from "."

export default {
  ...dataProvider.storyBlock,
  async createStoryBlock({ input, user }) {
    try {
      const result = await dataProvider.storyBlock.create({ input, user })
      await this.saveFrontStoryBlocksInRedis()
      return result
    } catch (error) {
      throw new Error(error)
    }
  },
  async updateStoryBlock({ id, input, user }) {
    try {
      const result = await dataProvider.storyBlock.update({ id, input, user })
      await this.saveFrontStoryBlocksInRedis()
      return result
    } catch (error) {
      throw new Error(error)
    }
  },
  async updateStoryBlocks({ filter, input, user }) {
    try {
      const results = await dataProvider.storyBlock.upsertMany({
        filter,
        input,
        user
      })
      await this.saveFrontStoryBlocksInRedis()
      return results
    } catch (error) {
      throw new Error(error)
    }
  },
  async deleteStoryBlock(id) {
    try {
      const result = await dataProvider.storyBlock.delete(id)
      await this.saveFrontStoryBlocksInRedis()
      return result
    } catch (error) {
      throw new Error(error)
    }
  },
  async frontStoryBlocks() {
    try {
      const result = await redisClient.get(FRONT_STORY_BLOCKS)
      return result
        ? JSON.parse(result)
        : await this.saveFrontStoryBlocksInRedis()
    } catch (error) {
      throw new Error(error)
    }
  },
  async storyBlock(id) {
    try {
      const result = await redisClient.get(id)
      return result ? JSON.parse(result) : await this.saveStoryBlockInRedis(id)
    } catch (error) {
      throw new Error(error)
    }
  },
  async saveFrontStoryBlocksInRedis() {
    try {
      const results = await dataProvider.storyBlock.getByFilter({
        parent: null,
        isEnabled: true
      })

      await redisClient.set(FRONT_STORY_BLOCKS, JSON.stringify(results))
      return results
    } catch (error) {
      throw new Error(error)
    }
  },
  async saveStoryBlockInRedis(id) {
    try {
      const storyBlockIdParentMap = new Map()
      const storyBlocks = await dataProvider.storyBlock.getAll()
      storyBlocks.forEach(item => {
        storyBlockIdParentMap.set(item.id, item.parent)
      })

      const storyBlockIds = [
        id,
        ...this.flattern(storyBlockIdParentMap, storyBlock)
      ]

      const storyBlock = await dataProvider.storyBlock.getById(id)
      const stories = await helpers.story
        .getPublishedStory({ storyBlock: { $in: storyBlockIds } })
        .sort({
          publishTime: "desc"
        })

      const result = { ...storyBlock, stories }
      await redisClient.set(id, JSON.stringify(result))
      return result
    } catch (error) {
      throw new Error(error)
    }
  },
  flattern(map, id) {
    const result = []
    map.forEach((value, key) => {
      if (value !== null && stringCompare(value, id)) {
        result.push(key)
        if (map.has(key)) {
          result.push(...this.flattern(map, key))
        }
      }
    })
    return result
  }
}
