import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { auth, removeSensitive } from "../../utils"

env.config()
const { CDN } = process.env

export default helpers => ({
  Query: {
    frontBanners: combineResolvers(auth.isAuthenticated, () =>
      helpers.banner.frontBanners()
    ),
    banners: combineResolvers(auth.isAuthenticated, (_, { filter }) =>
      helpers.banner.getByFilter(filter)
    ),
    banner: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.banner.getById(id)
    )
  },
  Mutation: {
    createBanner: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.banner.createBanner({ ...args, user })
    ),
    updateBanner: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.banner.updateBanner({ ...args, user })
    ),
    deleteBanner: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.banner.delete(id)
    )
  },
  Banner: {
    photoUrl: parent => (parent.photoUrl ? `${CDN}${parent.photoUrl}` : null),
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater))
  }
})
