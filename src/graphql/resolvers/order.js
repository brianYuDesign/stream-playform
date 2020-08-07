import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    orders: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.order.orders(args)
    ),
    order: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.order.getById(id)
    )
  },
  Mutation: {
    createOrder: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.order.createOrder({ ...args, user })
    ),
    updateOrder: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.order.update(args, { ...args, user })
    ),
    deleteOrder: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.order.delete(id)
    )
  },
  Order: {
    coin: parent => helpers.coin.getById(parent.coin),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
