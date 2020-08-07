import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"
import { FILE_PATH_STORIES } from "../../constants"

env.config()
const { CDN } = process.env

export default helpers => ({
  Query: {
    searchStoryTags: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.storyTag.searchStoryTags(args)
    ),
    storyTags: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.storyTag.getByFilter(filter)
    ),
    storyTag: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.storyTag.getById(id)
    )
  },
  Mutation: {
    createStoryTag: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.storyTag.create({ ...args, user })
    )
  },
  StoryTag: {
    storyLength: async parent =>
      (await helpers.story.getPublishedStory({ storyTags: parent.id })).length,
    stories: parent =>
      helpers.story.getPublishedStory({ storyTags: parent.id }),
    thumbnailUrl: async (parent, _args, { user }) => {
      const stories = await helpers.story.getPublishedStory({
        storyTags: parent.id
      })

      return stories.length > 0
        ? `${CDN}${FILE_PATH_STORIES}/origin/${stories[0].number}/${stories[0].number}_small.jpg`
        : null
    },
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
