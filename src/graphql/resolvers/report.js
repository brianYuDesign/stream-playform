import { combineResolvers } from "graphql-resolvers"
import { auth } from "../../utils"

export default helpers => ({
  Query: {
    dealerReports: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.report.dealerReports(args)
    )
  }
})
