import { combineResolvers } from "graphql-resolvers"
import { withFilter } from "graphql-subscriptions"
import { RECORD_NOTIFICATION } from "../../constants"
import { pubsub, auth, removeSensitive } from "../../utils"

export default helpers => ({
  Subscription: {
    recordNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([RECORD_NOTIFICATION]),
        async ({ recordNotification }, _variables, { user }) =>
          helpers.record.recordNotificationSubscibeFilter({
            recordNotification,
            user
          })
      )
    }
  },
  Query: {
    userRecords: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.record.userRecords({ ...args, user })
    ),
    records: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.record.records(args)
    ),
    record: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.record.getById(id)
    )
  },
  Record: {
    loginHistory: parent => helpers.loginHistory.getById(parent.loginHistory),
    order: parent => helpers.order.getById(parent.order),
    consumeHistory: parent =>
      helpers.consumeHistory.getById(parent.consumeHistory),
    reward: parent => helpers.reward.getById(parent.reward),
    reciver: async parent =>
      removeSensitive(await helpers.user.getById(parent.reciver)),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
