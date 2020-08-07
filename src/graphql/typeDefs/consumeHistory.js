import { gql } from "apollo-server-express"

export default gql`
  "消耗紀錄"
  type ConsumeHistory {
    id: ID!
    "交換類型"
    exchangeType: ConsumeHistoryExchangeType!
    "消耗coin數量"
    coin: Int
    "類型"
    type: ConsumeHistoryType!
    "兌換券"
    voucher: Voucher
    "訂閱"
    subscribe: Subscribe
    "動態"
    story: Story
    "聊天室"
    chatroom: Chatroom
    "玩具"
    toy: Toy
    "主播"
    artist: User!
    "經銷商"
    dealer: Dealer
    "建立者"
    creator: User
    "更新者"
    updater: User
    "建立時間"
    createdAt: DateTime
  }

  "兌換類型 ENUM"
  enum ConsumeHistoryExchangeType {
    "全部"
    ALL
    "優惠券"
    VOUCHER
    "代幣"
    COIN
  }

  "消耗類型 ENUM"
  enum ConsumeHistoryType {
    "全部"
    ALL
    "解鎖動態"
    UNLOCK_STORY
    "解鎖聊天"
    UNLOCK_CHAT
    "送禮"
    SEND_TOY
    "訂閱"
    SUBSCRIBE
  }

  extend type Query {
    "取得消耗紀錄"
    consumeHistories(
      pageSize: Int
      pageNumber: Int
      filter: ConsumeHistoryFilterInput
    ): ConsumeHistoryConnection
    "取得單一消耗紀錄"
    consumeHistory(id: ID): ConsumeHistory
  }

  extend type Mutation {
    "新增消耗紀錄(解鎖貼文 解鎖聊天 送玩具給主播)"
    createConsumeHistory(input: ConsumeHistoryCreateInput!): ConsumeHistory
    "編輯消耗紀錄"
    updateConsumeHistory(
      id: ID!
      input: ConsumeHistoryUpdateInput!
    ): ConsumeHistory
  }

  type ConsumeHistoryConnection {
    totalPage: Int
    consumeHistories: [ConsumeHistory]!
  }

  input ConsumeHistoryFilterInput {
    "兌換類型"
    exchangeType: String
    "類型"
    type: String
    "區間"
    period: String
    "年"
    year: Int
    "月"
    month: Int
    "建立者"
    creator: ID
    "經銷商"
    dealer: ID
    "主播"
    artist: ID
  }

  input ConsumeHistoryCreateInput {
    "兌換類型"
    exchangeType: ConsumeHistoryExchangeType!
    "消耗類型"
    type: ConsumeHistoryType!
    "兌換券"
    voucher: ID
    "動態"
    story: ID
    "聊天室"
    chatroom: ID
    "聊天內容"
    content: String
    "玩具"
    toy: ID
    "主播"
    artist: ID!
    "時間戳記"
    timeStamp: String!
  }

  input ConsumeHistoryUpdateInput {
    "兌換類型"
    exchangeType: ConsumeHistoryExchangeType!
    "消耗類型"
    type: ConsumeHistoryType!
    "兌換券"
    voucher: ID
    "動態"
    story: ID
    "聊天室"
    chatroom: ID
    "玩具"
    toy: ID
    "主播"
    artist: ID
  }
`
