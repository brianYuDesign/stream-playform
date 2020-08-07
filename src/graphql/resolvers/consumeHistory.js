import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    consumeHistories: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.consumeHistory.consumeHistories(args)
    ),
    consumeHistory: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.consumeHistory.getById(id)
    )
  },
  Mutation: {
    createConsumeHistory: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.consumeHistory.createConsumeHistory({ ...args, user })
    ),
    updateConsumeHistory: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.consumeHistory.update({ ...args, user })
    )
  },
  ConsumeHistory: {
    subscribe: parent => helpers.subscribe.getById(parent.subscribe),
    story: parent => helpers.story.getById(parent.story),
    chatroom: parent => helpers.chatroom.getById(parent.chatroom),
    toy: parent => helpers.toy.getById(parent.toy),
    voucher: parent => helpers.voucher.getById(parent.voucher),
    artist: async parent =>
      removeSensitive(await helpers.user.getById(parent.artist)),
    dealer: parent => helpers.dealer.getById(parent.dealer),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
