import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    features: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.feature.getByFilter(filter)
    ),
    feature: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.feature.getById(id)
    )
  },
  Mutation: {
    createFeature: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.feature.create({ ...args, user })
    ),
    updateFeature: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.feature.update({ ...args, user })
    ),
    deleteFeature: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.feature.delete(id)
    )
  },
  Feature: {
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
