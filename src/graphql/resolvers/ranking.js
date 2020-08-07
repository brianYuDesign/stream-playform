import { auth, paginate, removeSensitive } from "../../utils"
import { combineResolvers } from "graphql-resolvers"

export default helpers => ({
  Query: {
    rankings: combineResolvers(
      auth.isAuthenticated,
      async (_, { filter, pageSize = 10, after }) => {
        const results = await helpers.ranking.getRankingByTypeAndPeriod(filter)
        const rankings = paginate({
          after,
          pageSize,
          results,
          getCursor: item => item.artist
        })
        return {
          totalCount: results.length,
          rankings,
          cursor: rankings.length ? rankings[rankings.length - 1].artist : null,
          hasMore: rankings.length
            ? rankings[rankings.length - 1].user !==
              results[results.length - 1].user
            : false
        }
      }
    )
  },
  Ranking: {
    user: async parent =>
      removeSensitive(await helpers.user.getById(parent.user))
  }
})
