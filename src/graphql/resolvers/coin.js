import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    frontCoins: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.coin.frontCoins(args)
    ),
    coins: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.coin.getAll(filter)
    ),
    coin: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.coin.getById(id)
    )
  },
  Mutation: {
    createCoin: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.coin.create({ ...args, user })
    ),
    updateCoin: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.coin.update({ ...args, user })
    )
  },
  Coin: {
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
