import { combineResolvers } from "graphql-resolvers"
import env from "dotenv"
import { auth, removeSensitive } from "../../utils"
import {
  CONSUME_HISTORY_TYPE_UNLOCK_STORY,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN
} from "../../constants"

env.config()
const { CDN } = process.env

export default helpers => ({
  Query: {
    searchArtists: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.user.searchArtists(args)
    ),
    searchDealerUsers: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.user.searchDealerUsers(args)
    ),
    searchDateableArtists: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.user.searchDateableArtists(args)
    ),
    searchUsers: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.user.searchUsers(args)
    ),
    artists: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.artists({ ...args, user })
    ),
    users: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.users({ ...args, user })
    ),
    user: combineResolvers(auth.isAuthenticated, (_, { id }) =>
      helpers.user.getById(id)
    ),
    me: combineResolvers(auth.isAuthenticated, (_, _args, { user }) =>
      helpers.user.getById(user.id)
    )
  },
  Mutation: {
    createUser: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.createUser({ ...args, user })
    ),
    updateUser: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.updateUser({ ...args, user })
    ),
    updateUserInfo: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.user.updateUserInfo({ ...args, user })
    ),
    updateUserUid: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.updateUserUid({ ...args, user })
    ),
    followingUser: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.followingUser({ ...args, user })
    ),
    subscribingUser: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.user.subscribingUser({ ...args, user })
    ),
    blockingUser: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.user.blockingUser({ ...args, user })
    )
  },
  User: {
    avatar: parent => (parent.avatar ? `${CDN}${parent.avatar}` : null),
    background: parent =>
      parent.background ? `${CDN}${parent.background}` : null,
    isOnline: parent => helpers.realtime.checkUserIsOnline(parent.id),
    dealer: parent => helpers.dealer.getById(parent.dealer),
    roleFeature: parent => helpers.roleFeature.getById(parent.roleFeature),
    manageArtists: async parent =>
      parent.manageArtists.length !== 0
        ? removeSensitive(await helpers.user.getByIds(parent.manageArtists))
        : [],
    badges: parent => helpers.ranking.getUserBadges(parent.id),
    vouchers: (parent, _args, { user }) =>
      user.id === parent.id
        ? helpers.voucher.getByFilter({ owner: parent.id })
        : [],
    unlockStories: async parent => {
      const storyIds = (
        await helpers.consumeHistory.getByFilter({
          creator: parent.id,
          type: CONSUME_HISTORY_TYPE_UNLOCK_STORY
        })
      ).map(item => item.story)
      return storyIds !== [] ? helpers.story.getByIds(storyIds) : []
    },
    following: (parent, args) =>
      args && args.status
        ? parent.following.filter(item => item.status === args.status)
        : parent.following,
    followers: async parent =>
      parent.followers.length !== 0
        ? removeSensitive(await helpers.user.getByIds(parent.followers))
        : [],
    subscribing: (parent, args) =>
      args && args.status
        ? parent.subscribing.filter(item => item.status === args.status)
        : parent.subscribing,
    subscribers: async parent =>
      parent.subscribers.length !== 0
        ? removeSensitive(await helpers.user.getByIds(parent.subscribers))
        : [],
    blocking: (parent, args) =>
      args && args.status
        ? parent.blocking.filter(item => item.status === args.status)
        : parent.blocking,
    blockers: async parent =>
      parent.blockers.length !== 0
        ? removeSensitive(await helpers.user.getByIds(parent.blockers))
        : [],
    creator: async parent =>
      removeSensitive(await helpers.user.getById(parent.creator)),
    updater: async parent =>
      removeSensitive(await helpers.user.getById(parent.updater)),
    orders: parent => helpers.order.getByFilter({ creator: parent.id }),
    consumeHistories: parent =>
      helpers.consumeHistory.getByFilter({ creator: parent.id }),
    records: parent => helpers.record.getByFilter({ creator: parent.id }),
    artistConsumeHistories: parent =>
      helpers.consumeHistory.getByFilter({ artist: parent.id }),
    monthOfIncome: async parent =>
      (
        await helpers.consumeHistory.getByFilter({
          artist: parent.id,
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
    referrer: async parent =>
      removeSensitive(await helpers.user.getById(parent.referrer))
  },
  Following: {
    target: async parent =>
      removeSensitive(await helpers.user.getById(parent.target))
  },
  Subscribing: {
    target: async parent =>
      removeSensitive(await helpers.user.getById(parent.target))
  },
  Blocking: {
    target: async parent =>
      removeSensitive(await helpers.user.getById(parent.target))
  }
})
