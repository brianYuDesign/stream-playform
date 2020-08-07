import { gql } from "apollo-server-express"

export default gql`
  extend type Subscription {
    "日誌新增通知"
    recordNotification: Record
  }
  "Coin歷史紀錄"
  type Record {
    id: ID!
    "coin數量"
    coin: Int!
    "類型"
    type: RecordType!
    "描述"
    description: String
    "登入紀錄"
    loginHistory: LoginHistory
    "獎賞"
    reward: Reward
    "儲值Coin訂單"
    order: Order
    "Coin消耗紀錄"
    consumeHistory: ConsumeHistory
    "接收者"
    reciver: User
    "建立時間"
    createdAt: DateTime
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  type RecordConnection {
    totalPage: Int
    records: [Record]!
  }

  enum RecordType {
    "獎勵"
    REWARD
    "消耗"
    CONSUME
    "購買"
    BUYING
  }

  extend type Query {
    "前端取得個人Coin歷史紀錄"
    userRecords(type: RecordType): [Record]
    "取得Coin歷史紀錄"
    records(
      pageSize: Int
      pageNumber: Int
      filter: RecordFilterInput
    ): RecordConnection
    "取得單一Coin歷史紀錄"
    record(id: ID!): Record
  }

  input RecordFilterInput {
    "類型"
    type: String
    "建立者"
    creator: ID
  }
`
