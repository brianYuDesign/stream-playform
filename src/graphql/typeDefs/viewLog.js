import { gql } from "apollo-server-express"

export default gql`
  "觀看紀錄"
  type ViewLog {
    id: ID!
    "貼文"
    story: Story
    "建立者"
    creator: User
    "觀看時間"
    createdAt: DateTime
  }

  extend type Query {
    "取得觀看紀錄"
    viewLogs: [ViewLog]
    "取得單一觀看紀錄"
    viewLog(id: ID!): ViewLog
  }

  extend type Mutation {
    "新增觀看紀錄"
    createViewLog(input: ViewLogCreateInput!): ViewLog!
  }

  "觀看紀錄新增欄位"
  input ViewLogCreateInput {
    "貼文"
    story: ID!
  }
`
