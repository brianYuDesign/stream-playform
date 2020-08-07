import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { withFilter } from "graphql-subscriptions"
import { pubsub, auth, removeSensitive } from "../../utils"
import {
  NEW_PUBLISHED_STORY_OF_FOLLOW_ARTIST,
  STORY_TYPE_PHOTO,
  FILE_PATH_STORIES
} from "../../constants"
import { cloudFront } from "../../services"

env.config()
const { CDN } = process.env

export default helpers => ({
  Subscription: {
    newPublishedStoryOfFollowArtist: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([NEW_PUBLISHED_STORY_OF_FOLLOW_ARTIST]),
        async (payload, _variables, { user }) => {
          return helpers.story.newPublishedStoryOfFollowArtistSubscibeFilter({
            ...payload,
            user
          })
        }
      )
    }
  },
  Query: {
    pinnedStories: combineResolvers(auth.isAuthenticated, () =>
      helpers.story.pinnedStories()
    ),
    freeStories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.freeStories(args)
    ),
    searchStories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.searchStories(args)
    ),
    artistStories: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.story.artistStories({ ...args, user })
    ),
    storyTagStories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.storyTagStories(args)
    ),
    storyBlockStories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.storyBlockStories(args)
    ),
    frontStories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.frontStories(args)
    ),
    ownStories: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.story.ownStories({ ...args, user })
    ),
    stories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.story.stories(args)
    ),
    story: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.story.getById(id)
    )
  },
  Mutation: {
    createStory: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.story.createStory({ ...args, user })
    ),
    updateStory: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.story.updateStory({ ...args, user })
    ),
    deleteStory: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.story.delete(id)
    )
  },
  Story: {
    resourceUrl: async (parent, { isPreview }, { user, res }) => {
      if (isPreview) {
        return `${CDN}${FILE_PATH_STORIES}/preview/${parent.number}/${parent.number}_preview.m3u8`
      }

      const endPoint = await helpers.story.getResourceUrl({
        story: parent,
        user
      })

      const fileName = endPoint.substring(endPoint.lastIndexOf("/") + 1)
      const filePath = endPoint.replace(fileName, "*")
      cloudFront.getResource(filePath, res)

      return endPoint
    },
    thumbnailUrl: parent =>
      `${CDN}${FILE_PATH_STORIES}/origin/${parent.number}/${parent.number}.jpg`,
    smallThumbnailUrl: parent =>
      `${CDN}${FILE_PATH_STORIES}/origin/${parent.number}/${parent.number}_small.jpg`,
    isPurchased: (parent, _args, { user }) =>
      helpers.story.getPurchaseStatus({ story: parent, user }),
    storyBlock: parent => helpers.storyBlock.getById(parent.storyBlock),
    storyTags: parent => helpers.storyTag.getByIds(parent.storyTags),
    prevStory: (parent, { filter }, { user }) =>
      helpers.story.getPrevStory({ story: parent, filter, user }),
    nextStory: (parent, { filter }, { user }) =>
      helpers.story.getNextStory({ story: parent, filter, user }),
    unlockLength: async parent =>
      (await helpers.consumeHistory.getByFilter({ story: parent.id })).length,
    incomeCoin: async parent => {
      const consumeHistories = await helpers.consumeHistory.getByFilter({
        story: parent.id
      })
      return consumeHistories.reduce((prev, current) => prev + current.coin, 0)
    },
    views: async parent =>
      parent.fakeViews +
      (await helpers.viewLog.getByFilter({ story: parent.id })).length,
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
