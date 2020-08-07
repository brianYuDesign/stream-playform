import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    viewLogs: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.viewLog.getByFilter(filter)
    ),
    viewLog: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.viewLog.getById(id)
    )
  },
  Mutation: {
    createViewLog: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.viewLog.create({ ...args, user })
    )
  },
  ViewLog: {
    story: parent => helpers.story.getById(parent.story),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator))
  }
})
