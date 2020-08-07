import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    artistVouchers: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.voucher.artistVouchers({ filter: args, user })
    ),
    vouchers: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.voucher.getByFilter(filter)
    ),
    voucher: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.voucher.getById(id)
    )
  },
  Mutation: {
    createVoucher: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.voucher.create({ ...args, user })
    ),
    updateVoucher: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.voucher.update({ ...args, user })
    ),
    deleteVoucher: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.voucher.delete(id)
    )
  },
  Voucher: {
    hasDeadline: parent => !!parent.year,
    artist: async parent =>
      removeSensitive(await helpers.user.getById(parent.artist)),
    owner: async parent =>
      removeSensitive(await helpers.user.getById(parent.owner)),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
