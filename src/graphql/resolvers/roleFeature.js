import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    roleFeatures: combineResolvers(auth.isAuthenticated, () =>
      helpers.roleFeature.getAll()
    ),
    roleFeature: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.roleFeature.getById(id)
    )
  },
  Mutation: {
    createRoleFeature: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.roleFeature.create({ ...args, user })
    ),
    updateRoleFeature: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.roleFeature.update({ ...args, user })
    )
  },
  RoleFeature: {
    features: parent => helpers.feature.getByIds(parent.features),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
