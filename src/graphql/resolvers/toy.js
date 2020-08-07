import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

env.config()
const { CDN } = process.env

export default helpers => ({
  Query: {
    toys: combineResolvers(auth.isAuthenticated, () => helpers.toy.getAll()),
    toy: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.toy.getById(id)
    )
  },
  Mutation: {
    createToy: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.toy.createToy({ ...args, user })
    ),
    updateToy: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.toy.updateToy({ ...args, user })
    ),
    deleteToy: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.toy.delete(id)
    )
  },
  Toy: {
    photoUrl: parent => (parent.photoUrl ? `${CDN}${parent.photoUrl}` : null),
    toyType: parent => helpers.toyType.getById(parent.toyType),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
