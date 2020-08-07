import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    archives: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.consumeHistory.archives({ ...args, user })
    ),
    archive: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.consumeHistory.archive({ ...args, user })
    )
  },
  Archive: {
    total: parent => parent.stories.length,
    stories: parent => helpers.story.getByIds(parent.stories),
    artist: async parent =>
      removeSensitive(await helpers.user.getById(parent.artist))
  }
})
