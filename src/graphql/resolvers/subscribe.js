import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    subscribes: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.subscribe.getByFilter(filter)
    ),
    subscribe: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.subscribe.getById(id)
    )
  },
  Subscribe: {
    artist: async parent =>
      removeSensitive(await helpers.user.getById(parent.artist)),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
