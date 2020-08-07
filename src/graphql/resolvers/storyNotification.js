import { combineResolvers } from "graphql-resolvers"
import { auth, stringCompare, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    storyNotifications: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.storyNotification.storyNotifications({ ...args, user })
    )
  },
  Mutation: {
    readStoryNotification: combineResolvers(
      auth.isAuthenticated,
      (_parent, args, { user }) =>
        helpers.storyNotification.readStoryNotification({ ...args, user })
    )
  },
  StoryNotification: {
    latestStory: parent => helpers.story.getById(parent.latestStory),
    hasReadStory: (parent, _args, { user }) =>
      parent.readUserList.find(i => stringCompare(i, user.id)) !== undefined,
    readUserList: async parent =>
      removeSensitive(await helpers.user.getByIds(parent.readUserList)),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator))
  }
})
