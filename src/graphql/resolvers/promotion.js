import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    frontPromotions: combineResolvers(auth.isAuthenticated, () =>
      helpers.promotion.frontPromotions()
    ),
    promotions: combineResolvers(auth.isAuthenticated, () =>
      helpers.promotion.getAll()
    ),
    promotion: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.promotion.getById(id)
    )
  },
  Mutation: {
    createPromotion: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.promotion.create({ ...args, user })
    ),
    updatePromotion: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.promotion.update({ ...args, user })
    ),
    deletePromotion: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.promotion.delete(id)
    )
  },
  Promotion: {
    reward: parent => helpers.reward.getById(parent.reward),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
