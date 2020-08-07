import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    rewards: combineResolvers(auth.isAuthenticated, () =>
      helpers.reward.getAll()
    ),
    reward: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.reward.getById(id)
    )
  },
  Mutation: {
    createReward: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.reward.create({ ...args, user })
    ),
    updateReward: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.reward.update({ ...args, user })
    ),
    deleteReward: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.reward.delete(id)
    )
  },
  Reward: {
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
