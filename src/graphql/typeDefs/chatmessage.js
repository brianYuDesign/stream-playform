import { gql } from "apollo-server-express"

export default gql`
  "聊天訊息"
  type Chatmessage {
    id: ID!
    "類型"
    type: ChatmessageType!
    "內容"
    content: String!
    "檔案名稱"
    fileName: String
    "是否已讀"
    isRead: Boolean!
    "聊天室"
    chatroom: Chatroom!
    "代理者"
    agent: User
    "建立者"
    sender: User
    "建立時間"
    createdAt: DateTime
  }

  enum ChatmessageType {
    URL
    TEXT
    FILE
    IMAGE
    STICKER
    VIDEO
    RECORDING
  }

  extend type Subscription {
    "訂閱聊天室裡的訊息"
    chatroomMessage(chatroomId: ID!): Chatmessage
    "訂閱聊天室裡的訊息已讀未讀"
    chatroomMessageIsReadUpdated(chatroomId: ID!): ChatroomMessageIsReadUpdated
    "訂閱左上角通知"
    chatmessageNotification: ChatmessageNotification
  }

  extend type Query {
    "聊天室訊息"
    chatroomChatMessages(
      pageSize: Int
      before: String
      chatroom: ID!
    ): ChatMessageConnection
  }

  extend type Mutation {
    "新增訊息"
    createChatmessage(input: ChatmessageCreateInput!): Chatmessage
    "新增群發訊息"
    createChatmessages(
      artist: ID!
      input: ChatmessagesCreateInput!
    ): [Chatmessage]
  }

  input ChatmessageCreateInput {
    "類型"
    type: ChatmessageType!
    "內容"
    content: String
    "檔案名稱"
    fileName: String
    "檔案(圖片)"
    file: Upload
    "聊天室"
    chatroom: ID!
  }

  input ChatmessagesCreateInput {
    "類型"
    type: ChatmessageType!
    "內容"
    content: String
    "檔案名稱"
    fileName: String
    "檔案(圖片)"
    file: Upload
  }

  "新訊息提醒"
  type ChatmessageNotification {
    "聊天室"
    chatroom: Chatroom
    "新訊息"
    chatmessage: Chatmessage
  }

  "訊息已讀更新"
  type ChatroomMessageIsReadUpdated {
    "聊天室"
    chatroom: Chatroom
    "聊天室訊息"
    chatmessages: [Chatmessage]
  }

  type ChatMessageConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    chatmessages: [Chatmessage]!
  }
`
