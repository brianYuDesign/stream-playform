import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"
import { CONSUME_HISTORY_EXCHANGE_TYPE_COIN } from "../../constants"

env.config()
const { CDN } = process.env

export default helpers => ({
  Query: {
    dealers: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.dealer.getByFilter(filter)
    ),
    dealer: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.dealer.getById(id)
    )
  },
  Mutation: {
    createDealer: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.dealer.createDealer({ ...args, user })
    ),
    updateDealer: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.dealer.updateDealer({ ...args, user })
    )
  },
  Dealer: {
    contractUrl: parent =>
      parent.contractUrl ? `${CDN}${parent.contractUrl}` : null,
    systemUser: async parent =>
      removeSensitive(await helpers.user.getById(parent.systemUser)),
    artists: async parent =>
      removeSensitive(await helpers.user.getByFilter({ dealer: parent.id })),
    consumeHistories: parent =>
      helpers.consumeHistory.getByFilter({ dealer: parent.id }),
    monthOfIncome: async parent =>
      (
        await helpers.consumeHistory.getByFilter({
          dealer: parent.id,
          exchangeType: CONSUME_HISTORY_EXCHANGE_TYPE_COIN,
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
              0,
              0,
              0
            ),
            $lt: new Date()
          }
        })
      ).reduce((prev, current) => prev + current.coin, 0),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
