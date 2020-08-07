import dataProvider from "../data-provider"
import { pubsub, paginate, stringCompare } from "../utils"
import { s3Service } from "../services"
import {
  CHATMESSAGE_NOTIFICATION,
  CHATROOM_MESSAGE,
  CHATMESSAGE_TYPE_FILE,
  CHATMESSAGE_TYPE_IMAGE,
  CHATMESSAGE_TYPE_VIDEO,
  CHATMESSAGE_TYPE_RECORDING,
  FILE_PATH_CHATROOMS,
  CHATROOM_MESSAGE_IS_READ_UPDATED,
  CHATROOM_UPDATED
} from "../constants"

export default {
  ...dataProvider.chatmessage,
  async createChatmessage({ input, user }) {
    let chatroom = await dataProvider.chatroom.getById(input.chatroom)
    const participants = chatroom.participants.map(item => item.user)
    const artistId = chatroom.participants.find(item => item.replyCoin === 0)
      .user

    let IsAgent = false

    if (
      !participants.find(item => stringCompare(item, user.id)) &&
      !!user.manageArtists.find(item => stringCompare(item, artistId))
    ) {
      IsAgent = true
    }

    let newChatmessage = IsAgent
      ? await dataProvider.chatmessage.create({
          input: {
            ...input,
            agent: user.id,
            sender: artistId
          },
          user
        })
      : await dataProvider.chatmessage.create({
          input: {
            ...input,
            sender: user.id
          },
          user
        })

    // 是否為檔案
    if (
      input.file &&
      (input.type.toString() === CHATMESSAGE_TYPE_FILE ||
        input.type.toString() === CHATMESSAGE_TYPE_IMAGE ||
        input.type.toString() === CHATMESSAGE_TYPE_VIDEO ||
        input.type.toString() === CHATMESSAGE_TYPE_RECORDING)
    ) {
      newChatmessage = await dataProvider.chatmessage.update({
        id: newChatmessage.id,
        user,
        input: {
          content: await s3Service.storeFileToS3({
            filePath: `${FILE_PATH_CHATROOMS}/${chatroom.id}`,
            file: await input.file
          })
        }
      })
    }

    // 更新聊天室最新訊息
    chatroom = await dataProvider.chatroom.update({
      id: chatroom.id,
      input: { lastMessage: newChatmessage.id }
    })

    await this.updateChatmessagesToRead({ chatroom, user })

    // 推播的訂閱
    await pubsub.publish(CHATMESSAGE_NOTIFICATION, {
      chatmessageNotification: {
        chatroom,
        chatmessage: newChatmessage
      }
    })
    // 聊天室訊息訂閱
    await pubsub.publish(CHATROOM_MESSAGE, {
      chatroomMessage: newChatmessage
    })

    // // 聊天室訂閱
    // await pubsub.publish(CHATROOM_UPDATED, {
    //   chatroomUpdated: chatroom
    // })

    return newChatmessage
  },
  async createChatmessages({ artist, input, user }) {
    // 搜尋所有符合的聊天室
    const artistChatrooms = await dataProvider.chatroom.getByFilter({
      "participants.user": artist
    })
    const chatmessages = await Promise.all(
      artistChatrooms.map(async item =>
        this.createChatmessage({ input: { ...input, chatroom: item.id }, user })
      )
    )
    return chatmessages
  },
  chatmessageNotificationSubscribeFilter: async (
    { chatmessage, chatroom },
    user
  ) => {
    if (
      !stringCompare(chatmessage.sender, user.id) ||
      !stringCompare(chatmessage.agent, user.id)
    ) {
      const participants = chatroom.participants.map(item => item.user)
      const artistId = chatroom.participants.find(item => item.replyCoin === 0)
        .user
      const managers = await dataProvider.user.getByFilter({
        manageArtists: artistId
      })

      return (
        participants.includes(user.id) ||
        managers.manageArtists.find(item => stringCompare(item, user.id)) !==
          undefined
      )
    }
    return false
  },
  updateChatmessagesToRead: async ({ chatroom, user }) => {
    const messages = await dataProvider.chatmessage.getByFilter({
      chatroom: chatroom.id,
      sender: { $ne: user.id },
      agent: { $ne: user.id },
      isRead: false
    })

    const messageIds = messages.map(item => item.id)

    await dataProvider.chatmessage.updateMany({
      user,
      filter: {
        _id: { $in: messageIds }
      },
      input: { isRead: true }
    })

    const chatmessages = await dataProvider.chatmessage.getByFilter({
      _id: { $in: messageIds }
    })

    await pubsub.publish(CHATROOM_MESSAGE_IS_READ_UPDATED, {
      chatroomMessageIsReadUpdated: {
        chatroom,
        chatmessages
      }
    })

    await pubsub.publish(CHATROOM_UPDATED, {
      chatroomUpdated: chatroom
    })

    return chatmessages
  },
  getUnreadMessage: async ({ chatroom, user }) =>
    dataProvider.chatmessage.getByFilter({
      chatroom: chatroom.id,
      isRead: false,
      sender: { $ne: user.id },
      agent: { $ne: user.id }
    }),
  chatroomChatMessages: async ({ chatroom, pageSize = 10, before }) => {
    const results = await dataProvider.chatmessage
      .getByFilter({
        chatroom
      })
      .sort({
        createdAt: "desc"
      })

    const chatmessages = paginate({
      after: before,
      pageSize,
      results
    }).reverse()
    return {
      totalCount: results.length,
      chatmessages,
      cursor: chatmessages.length ? chatmessages[0].id : null,
      hasMore: chatmessages.length
        ? chatmessages[0].id !== results[results.length - 1].id
        : false
    }
  }
}
