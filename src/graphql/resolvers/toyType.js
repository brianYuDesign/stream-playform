import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    toyTypes: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.toyType.toyTypes(args)
    ),
    toyType: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.toyType.getById(id)
    )
  },
  Mutation: {
    createToyType: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.toyType.create({ ...args, user })
    ),
    updateToyType: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.toyType.update({ ...args, user })
    ),
    deleteToyType: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.toyType.delete(id)
    )
  },
  ToyType: {
    toys: parent =>
      helpers.toy.getByFilter({ toyType: parent.id, isEnabled: true }),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
