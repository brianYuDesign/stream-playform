import { gql } from "apollo-server-express"

export default gql`
  "聊天室"
  type Chatroom {
    id: ID!
    "最後一筆訊息"
    lastMessage: Chatmessage
    "所有訊息"
    chatmessages: [Chatmessage]
    "聊天參加者"
    participants: [Participant]
    "使用者未讀"
    unreadCount: Int
  }
  "參加者"
  type Participant {
    "使用者"
    user: User
    "發送訊息價格"
    replyCoin: Int
  }

  type ChatroomConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    chatrooms: [Chatroom]!
  }

  extend type Subscription {
    "訂閱聊天室"
    chatroomUpdated(artist: ID): Chatroom
  }

  extend type Query {
    "後台取得代理主播的所有聊天室"
    artistChatrooms(artist: ID!): [Chatroom]
    "前台用戶與主播間的聊天室"
    artistChatroom(artist: ID!): Chatroom
    "用戶參加的所有聊天室"
    chatrooms(pageSize: Int, after: String): ChatroomConnection
    "取得單一聊天室"
    chatroom(id: ID!): Chatroom
  }
`
