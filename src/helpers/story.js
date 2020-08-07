import env from "dotenv"
import _ from "lodash"
import { UserInputError } from "apollo-server-express"
import { paginate, pubsub, stringCompare } from "../utils"
import { s3Service, cloudFront } from "../services"
import {
  STORY_STATUS_PUBLISHED,
  FILE_PATH_STORIES,
  NEW_PUBLISHED_STORY_OF_FOLLOW_ARTIST,
  STORY_STATUS_CREATED,
  CHARACTER_LENGTH,
  CHARACTER,
  USER_FOLLOW_STATUS_FOLLOW,
  STORY_TYPE_PHOTO,
  CONSUME_HISTORY_TYPE_UNLOCK_STORY,
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_MP4,
  FILE_TYPE_MOV,
  REDIS_PINNED_STORY_LENGTH
} from "../constants"
import dataProvider from "../data-provider"
import redisClient from "../redis/connection"
import helpers from "."

env.config()
const { CDN, PINNED_STORY_LENGTH } = process.env

export default {
  ...dataProvider.story,
  getPublishedStory: filter =>
    dataProvider.story.getByFilter({
      ...filter,
      status: STORY_STATUS_PUBLISHED,
      publishTime: { $lt: new Date() },
      endTime: { $gt: new Date() }
    }),
  async pinnedStories() {
    const stories = (await this.getPublishedStory({ isPinned: true })).slice(
      0,
      Number(
        (await redisClient.get(REDIS_PINNED_STORY_LENGTH)) ||
          PINNED_STORY_LENGTH
      )
    )

    return stories
  },
  async freeStories({ pageSize = 10, after }) {
    const results = this.getPublishedStory({ necessaryCoin: 0 }).sort({
      publishTime: "desc"
    })

    const stories = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async searchStories({ filter, pageSize = 10, after }) {
    const results = filter
      ? await this.getPublishedStory({
          content: { $regex: filter.content, $options: "i" }
        }).sort({
          publishTime: "desc"
        })
      : await this.getPublishedStory().sort({
          publishTime: "desc"
        })
    const stories = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async artistStories({ artist, pageSize = 10, after, user }) {
    const results = !stringCompare(artist, user.id)
      ? await this.getPublishedStory({ creator: artist }).sort({
          createdAt: "desc"
        })
      : await dataProvider.story
          .getByFilter({ creator: artist })
          .sort({ createdAt: "desc" })

    const stories = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async storyTagStories({ storyTag, pageSize = 10, after }) {
    const results = await this.getPublishedStory({ storyTags: storyTag }).sort({
      publishTime: "desc"
    })

    const stories = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async storyBlockStories({ storyBlock, pageSize = 10, after }) {
    try {
      const results = (await helpers.storyBlock.storyBlock(storyBlock)).stories
      const stories = paginate({
        after,
        pageSize,
        results
      })
      return {
        totalCount: results.length,
        stories,
        cursor: stories.length ? stories[stories.length - 1].id : null,
        hasMore: stories.length
          ? stories[stories.length - 1].id !== results[results.length - 1].id
          : false
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  async frontStories({ pageSize = 10, after }) {
    const results = await this.getPublishedStory().sort({
      publishTime: "desc"
    })

    const stories = paginate({
      after,
      pageSize,
      results
    })

    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  ownStories: async ({ pageSize = 10, after, user }) => {
    const results = await dataProvider.story
      .getByFilter({
        creator: user.id
      })
      .sort({
        publishTime: "desc"
      })

    const stories = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      stories,
      cursor: stories.length ? stories[stories.length - 1].id : null,
      hasMore: stories.length
        ? stories[stories.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  stories: async ({ pageSize = 10, pageNumber, filter }) => {
    const results = await dataProvider.story.paginate(
      {
        ...(filter &&
          filter.content && {
            content: { $regex: filter.content, $options: "i" }
          }),
        ...(filter &&
          filter.status && {
            status: filter.status
          }),
        ...(filter &&
          filter.type && {
            type: filter.type
          }),
        ...(filter &&
          filter.isPinned !== undefined &&
          filter.isPinned !== "" && {
            isPinned: filter.isPinned
          }),
        ...(filter && filter.creator && { creator: filter.creator })
      },
      {
        pageSize,
        pageNumber,
        sort: { updatedAt: "-1" }
      }
    )

    return {
      totalPage: results.totalPages,
      stories: results.docs
    }
  },
  async createStory({ input, user }) {
    try {
      let storyTags
      if (input.storyTagNames) {
        storyTags = await Promise.all(
          input.storyTagNames.map(async item => {
            const storyTag = await helpers.storyTag.getOne({ name: item })
            if (storyTag) {
              return storyTag.id
            }
            return (
              await helpers.storyTag.create({ input: { name: item }, user })
            ).id
          })
        )
      } else {
        storyTags = input.storyTags
      }

      const newStory = await dataProvider.story.create({
        input: {
          ..._.omit(input, ["storyTagNames"]),
          storyTags,
          number: await this.generateStoryNumber(),
          status: STORY_STATUS_CREATED
        },
        user
      })

      await helpers.storyBlock.saveStoryBlockInRedis(newStory.storyBlock)

      return dataProvider.story.update({
        id: newStory.id,
        user,
        input: {
          ...(input.file && {
            lastUploadTime: new Date(),
            downloadUrl: await s3Service.storeFileToS3({
              filePath:
                input.type === STORY_TYPE_PHOTO
                  ? `${FILE_PATH_STORIES}/origin/${newStory.number}/imageTmp`
                  : `${FILE_PATH_STORIES}/origin/${newStory.number}`,
              file: await input.file,
              validateTypes: [
                FILE_TYPE_JPEG,
                FILE_TYPE_JPG,
                FILE_TYPE_MP4,
                FILE_TYPE_MOV
              ],
              newFileName:
                input.type === STORY_TYPE_PHOTO
                  ? `${newStory.number}_original.jpg`
                  : `${newStory.number}.mp4`
            })
          })
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  async updateStory({ id, input, user }) {
    if (input.isPinned) {
      if (input.publishTime > new Date() || !input.publishTime) {
        throw new UserInputError("置頂貼文邏輯有誤")
      }
    }

    let updatedStory = await dataProvider.story.getById(id)

    updatedStory = await dataProvider.story.update({
      id: updatedStory.id,
      input: {
        ..._.omit(input, ["storyTagNames"]),
        ...(input.file && {
          lastUploadTime: new Date(),
          downloadUrl: await s3Service.storeFileToS3({
            filePath:
              input.type === STORY_TYPE_PHOTO
                ? `${FILE_PATH_STORIES}/origin/${updatedStory.number}/imageTmp`
                : `${FILE_PATH_STORIES}/origin/${updatedStory.number}`,
            file: await input.file,
            validateTypes: [
              FILE_TYPE_JPEG,
              FILE_TYPE_JPG,
              FILE_TYPE_MP4,
              FILE_TYPE_MOV
            ],
            newFileName:
              input.type === STORY_TYPE_PHOTO
                ? `${updatedStory.number}_original.jpg`
                : `${updatedStory.number}.mp4`
          })
        })
      },
      user
    })

    if (input.thumbnail) {
      await s3Service.storeFileToS3({
        filePath: `${FILE_PATH_STORIES}/origin/${updatedStory.number}/imageTmp`,
        file: await input.thumbnail,
        validateTypes: [FILE_TYPE_JPG, FILE_TYPE_JPEG],
        newFileName: `${updatedStory.number}_cover_large.jpg`
      })
    }

    if (input.smallThumbnail) {
      await s3Service.storeFileToS3({
        filePath: `${FILE_PATH_STORIES}/origin/${updatedStory.number}/imageTmp`,
        file: await input.smallThumbnail,
        validateTypes: [FILE_TYPE_JPG, FILE_TYPE_JPEG],
        newFileName: `${updatedStory.number}_cover_small.jpg`
      })
    }

    if (
      updatedStory.status === STORY_STATUS_PUBLISHED &&
      updatedStory.publishTime < new Date()
    ) {
      // 主播動態更新最新貼文，閱讀名單刷新
      const existStoryNotification = await dataProvider.storyNotification.getOne(
        {
          creator: updatedStory.creator
        }
      )

      if (existStoryNotification === null) {
        // 動態狀態更改為發佈，通知符合訂閱的使用者
        await pubsub.publish(NEW_PUBLISHED_STORY_OF_FOLLOW_ARTIST, {
          newPublishedStoryOfFollowArtist: updatedStory
        })
        await dataProvider.storyNotification.create({
          input: {
            latestStory: updatedStory.id,
            readUserList: [],
            creator: updatedStory.creator
          }
        })
      }

      await helpers.storyBlock.saveStoryBlockInRedis(updatedStory.storyBlock)

      if (existStoryNotification) {
        if (existStoryNotification.latestStory === updatedStory.id) {
          return updatedStory
        }

        await dataProvider.storyNotification.update({
          id: existStoryNotification.id,
          input: {
            latestStory: updatedStory.id,
            readUserList: [],
            updater: updatedStory.creator
          }
        })
      }
    }

    return updatedStory
  },
  replacePinnedStory: async () =>
    dataProvider.story.updateMany({
      filter: { isPinned: true },
      input: { isPinned: false }
    }),
  isNumberValueExist: async number => {
    const isExistStory = await dataProvider.story.getOne({ number })
    return isExistStory !== null
  },
  async generateStoryNumber() {
    let result = ""
    for (let i = 0; i < 6; i += 1) {
      result += CHARACTER.charAt(Math.floor(Math.random() * CHARACTER_LENGTH))
    }

    if (await this.isNumberValueExist(result)) {
      return this.generateStoryNumber()
    }
    return result
  },
  newPublishedStoryOfFollowArtistSubscibeFilter: async ({
    newPublishedStoryOfFollowArtist,
    user
  }) => {
    return user
      ? user.following
          .filter(item => item.status === USER_FOLLOW_STATUS_FOLLOW)
          .map(item => item.target)
          .includes(newPublishedStoryOfFollowArtist.creator)
      : false
  },
  getNextStory: async ({ story, filter, user }) => {
    let stories
    if (filter && filter.isFree) {
      stories = await dataProvider.story
        .getByFilter({
          necessaryCoin: 0,
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $lt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    } else if (filter && filter.isArchived) {
      const isArchivedStoryIds = (
        await dataProvider.consumeHistory.getByFilter({
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          creator: user.id,
          ...(filter.creator && { artist: filter.creator })
        })
      ).map(item => item.story)

      stories = await dataProvider.story
        .getByFilter({
          _id: { $in: isArchivedStoryIds },
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $lt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    } else {
      filter && delete filter.isArchived
      filter && delete filter.isFree

      stories = await dataProvider.story
        .getByFilter({
          ...filter,
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $lt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    }

    if (stories.length === 0) {
      return null
    }
    return stories[0]
    // return stories[stories.length - 1].id !== story.id
    //   ? stories[stories.length - 1]
    //   : stories[stories.length - 2]
  },
  getPrevStory: async ({ story, filter, user }) => {
    let stories
    if (filter && filter.isFree) {
      stories = await dataProvider.story
        .getByFilter({
          necessaryCoin: 0,
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $gt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    } else if (filter && filter.isArchived) {
      const isArchivedStoryIds = (
        await dataProvider.consumeHistory.getByFilter({
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY,
          creator: user.id,
          ...(filter.creator && { artist: filter.creator })
        })
      ).map(item => item.story)

      stories = await dataProvider.story
        .getByFilter({
          _id: { $in: isArchivedStoryIds },
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $gt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    } else {
      filter && delete filter.isArchived
      filter && delete filter.isFree

      stories = await dataProvider.story
        .getByFilter({
          ...filter,
          status: STORY_STATUS_PUBLISHED,
          publishTime: { $gt: story.publishTime },
          endTime: { $gte: new Date() }
        })
        .sort({
          publishTime: "desc"
        })
    }
    if (stories.length === 0) {
      return null
    }
    return stories[stories.length - 1]
  },
  async getPurchaseStatus({ story, user }) {
    if (!user) {
      return false
    }

    if (story.creator === user.id) {
      return true
    }

    const consumeHistory = await dataProvider.consumeHistory.getOne({
      creator: user.id,
      story: story.id
    })

    return consumeHistory !== null
  },
  async getResourceUrl({ story, user }) {
    const photoUrl = `${CDN}${FILE_PATH_STORIES}/origin/${story.number}/${story.number}.jpg`
    const previewUrl = `${CDN}${FILE_PATH_STORIES}/preview/${story.number}/${story.number}_preview.m3u8`
    const archiveUrl = `${CDN}${FILE_PATH_STORIES}/watermark/${story.number}/${story.number}_watermark.m3u8`
    // 如果story類型是photo
    if (story.type === STORY_TYPE_PHOTO) {
      return photoUrl
    }

    // 檢查消費紀錄
    const consumeHistory = await dataProvider.consumeHistory.getOne({
      creator: user.id,
      story: story.id
    })

    if (
      consumeHistory ||
      stringCompare(story.creator, user.id) ||
      stringCompare(
        user.roleFeature,
        await helpers.roleFeature.getRoleAdminId()
      ) ||
      stringCompare(
        user.roleFeature,
        await helpers.roleFeature.getRoleManagerId()
      )
    ) {
      return archiveUrl
    }

    return previewUrl
  }
}
