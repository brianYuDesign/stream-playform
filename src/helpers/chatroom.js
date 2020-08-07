import { UserInputError } from "apollo-server-core"
import env from "dotenv"
import { paginate, stringCompare } from "../utils"
import dataProvider from "../data-provider"
import { REDIS_CHAT_COIN } from "../constants"
import redisClient from "../redis/connection"
import helpers from "."

env.config()
const { CHAT_COIN } = process.env

export default {
  ...dataProvider.chatroom,
  chatrooms: async ({ pageSize = 10, after, user }) => {
    const results = await dataProvider.chatroom
      .getByFilter({
        $and: [{ "participants.user": user.id }, { lastMessage: { $ne: null } }]
      })
      .sort({
        updatedAt: "asc"
      })
    results.reverse()
    const chatrooms = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      chatrooms,
      cursor: chatrooms.length ? chatrooms[chatrooms.length - 1].id : null,
      hasMore: chatrooms.length
        ? chatrooms[chatrooms.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async chatroom({ id, user }) {
    const chatroom = await dataProvider.chatroom.getById(id)
    await this.checkPermission({ chatroom, user })
    await helpers.chatmessage.updateChatmessagesToRead({ chatroom, user })
    return chatroom
  },
  artistChatrooms: async ({ artist, user }) => {
    // if (!user.manageArtists.find(item => stringCompare(item, artist))) {
    //   throw new ForbiddenError("您無法操作此主播的聊天行為")
    // }
    return dataProvider.chatroom
      .getByFilter({
        $and: [{ "participants.user": artist }, { lastMessage: { $ne: null } }]
      })
      .sort({
        updatedAt: "desc"
      })
  },
  artistChatroom: async ({ artist, user }) => {
    if (stringCompare(artist, user.id)) {
      throw new UserInputError("無法取得，操作有誤")
    }

    const chatrooms = await dataProvider.chatroom.getByFilter({
      "participants.user": user.id
    })

    if (chatrooms.length === 0) {
      return dataProvider.chatroom.create({
        input: {
          participants: [
            { user: artist, replyCoin: 0 },
            {
              user: user.id,
              replyCoin: Number(
                (await redisClient.get(REDIS_CHAT_COIN)) || CHAT_COIN
              )
            }
          ]
        },
        user
      })
    }

    const chatroom = chatrooms.find(chatroom =>
      chatroom.participants.some(item => stringCompare(item.user, artist))
    )

    if (!chatroom) {
      return dataProvider.chatroom.create({
        input: {
          participants: [
            { user: artist, replyCoin: 0 },
            {
              user: user.id,
              replyCoin: Number(
                (await redisClient.get(REDIS_CHAT_COIN)) || CHAT_COIN
              )
            }
          ]
        },
        user
      })
    }

    await helpers.chatmessage.updateChatmessagesToRead({
      chatroom,
      user
    })
    return chatroom
  },
  checkPermission: async ({ chatroom, user }) => {
    const participants = chatroom.participants.map(item =>
      JSON.stringify(item.user)
    )
    const manageArtists = user.manageArtists.map(item => JSON.stringify(item))

    if (
      !manageArtists.some(item => participants.includes(item)) &&
      !participants.find(item => stringCompare(item, user.id))
    ) {
      throw new ForbiddenError("您無法操作此主播的聊天行為")
    }

    return
  }
}
