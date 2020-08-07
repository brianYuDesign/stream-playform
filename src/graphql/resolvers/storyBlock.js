import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    frontStoryBlocks: combineResolvers(auth.isAuthenticated, () =>
      helpers.storyBlock.frontStoryBlocks()
    ),
    storyBlocks: combineResolvers(auth.isAuthenticated, () =>
      helpers.storyBlock.getAll()
    ),
    storyBlock: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.storyBlock.storyBlock(id)
    )
  },
  Mutation: {
    createStoryBlock: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.storyBlock.createStoryBlock({ ...args, user })
    ),
    updateStoryBlock: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.storyBlock.updateStoryBlock({ ...args, user })
    ),
    updateStoryBlocks: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.storyBlock.updateStoryBlocks({ ...args, user })
    ),
    deleteStoryBlock: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.storyBlock.deleteStoryBlock(id)
    )
  },
  StoryBlock: {
    storyLength: async parent =>
      (await helpers.story.getPublishedStory({ storyBlock: parent.id })).length,
    parentId: parent => parent.parent,
    parent: parent => helpers.storyBlock.getById(parent.parent),
    children: parent => helpers.storyBlock.getByFilter({ parent: parent.id }),
    stories: parent =>
      helpers.story.getPublishedStory({ storyBlock: parent.id }).sort({
        publishTime: "desc"
      }),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
