import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

export default helpers => ({
  Query: {
    loginHistories: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.loginHistory.getByFilter(filter)
    ),
    loginHistory: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.loginHistory.getById(id)
    )
  },
  LoginHistory: {
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator))
  }
})
