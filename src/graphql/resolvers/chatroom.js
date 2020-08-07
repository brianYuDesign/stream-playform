import { combineResolvers } from "graphql-resolvers"
import { withFilter } from "graphql-subscriptions"
import { pubsub, auth, removeSensitive } from "../../utils"
import { CHATROOM_UPDATED } from "../../constants"

export default helpers => ({
  Subscription: {
    chatroomUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHATROOM_UPDATED]),
        async ({ chatroomUpdated }, { artist }, { user }) =>
          artist
            ? chatroomUpdated.participants
                .map(item => String(item.user))
                .includes(String(artist))
            : chatroomUpdated.participants
                .map(item => String(item.user))
                .includes(String(user.id))
      )
    }
  },
  Query: {
    artistChatrooms: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.chatroom.artistChatrooms({ ...args, user })
    ),
    artistChatroom: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) => helpers.chatroom.artistChatroom({ ...args, user })
    ),
    chatrooms: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.chatroom.chatrooms({ ...args, user })
    ),
    chatroom: combineResolvers(auth.isAuthenticated, (_, args, { user }) =>
      helpers.chatroom.chatroom({ ...args, user })
    )
  },
  Chatroom: {
    unreadCount: async (parent, _args, { user }) =>
      (await helpers.chatmessage.getUnreadMessage({ chatroom: parent, user }))
        .length,
    lastMessage: parent => helpers.chatmessage.getById(parent.lastMessage),
    chatmessages: parent =>
      helpers.chatmessage.getByFilter({ chatroom: parent.id })
  },
  Participant: {
    user: async parent =>
      removeSensitive(await helpers.user.getById(parent.user))
  }
})
