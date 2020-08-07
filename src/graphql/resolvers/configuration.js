import { combineResolvers } from "graphql-resolvers"
import { auth } from "../../utils"

export default helpers => ({
  Query: {
    configuration: combineResolvers(auth.isAuthenticated, () =>
      helpers.configuration.getConfiguration()
    )
  },
  Mutation: {
    updateConfiguration: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.configuration.updateConfiguration(args.input)
    )
  }
})
