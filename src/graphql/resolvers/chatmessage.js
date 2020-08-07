import env from "dotenv"
import { combineResolvers } from "graphql-resolvers"
import { withFilter } from "graphql-subscriptions"
import { pubsub, auth, stringCompare, removeSensitive } from "../../utils"
import {
  CHATMESSAGE_NOTIFICATION,
  CHATROOM_MESSAGE,
  CHATROOM_MESSAGE_IS_READ_UPDATED,
  CHATMESSAGE_TYPE_TEXT
} from "../../constants"

env.config()
const { CDN } = process.env

export default helpers => ({
  Subscription: {
    chatmessageNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHATMESSAGE_NOTIFICATION]),
        async ({ chatmessageNotification }, _variables, { user }) => {
          if (!user) {
            return false
          }

          return helpers.chatmessage.chatmessageNotificationSubscribeFilter(
            chatmessageNotification,
            user
          )
        }
      )
    },
    chatroomMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHATROOM_MESSAGE]),
        async ({ chatroomMessage }, { chatroomId }, { user }) => {
          if (!stringCompare(chatroomMessage.chatroom, chatroomId) || !user) {
            return false
          }
          // 推送單筆訊息到聊天室裡時，因對話處於開啟狀態，會將聊天室內對方的訊息全部已讀
          await helpers.chatmessage.updateChatmessagesToRead({
            chatroom: await helpers.chatroom.getById(chatroomMessage.chatroom),
            user
          })

          return true
        }
      )
    },
    chatroomMessageIsReadUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([CHATROOM_MESSAGE_IS_READ_UPDATED]),
        async ({ chatroomMessageIsReadUpdated }, { chatroomId }, { user }) => {
          if (!user) {
            return false
          }
          return (
            stringCompare(
              chatroomMessageIsReadUpdated.chatroom.id,
              chatroomId
            ) && chatroomMessageIsReadUpdated.chatmessages.length > 0
          )
        }
      )
    }
  },
  Query: {
    chatroomChatMessages: combineResolvers(auth.isAuthenticated, (_, args) =>
      helpers.chatmessage.chatroomChatMessages({ ...args })
    )
  },
  Mutation: {
    createChatmessage: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.chatmessage.createChatmessage({ ...args, user })
    ),
    createChatmessages: combineResolvers(
      auth.isAuthenticated,
      (_, args, { user }) =>
        helpers.chatmessage.createChatmessages({ ...args, user })
    )
  },
  Chatmessage: {
    content: parent =>
      parent.type === CHATMESSAGE_TYPE_TEXT
        ? parent.content
        : `${CDN}${parent.content}`,
    chatroom: parent => helpers.chatroom.getById(parent.chatroom),
    sender: async parent =>
      removeSensitive(await helpers.user.getById(parent.sender)),
    agent: async parent =>
      removeSensitive(await helpers.user.getById(parent.agent))
  }
})
