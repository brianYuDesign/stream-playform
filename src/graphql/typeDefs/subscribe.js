import { gql } from "apollo-server-express"

export default gql`
  "訂閱紀錄"
  type Subscribe {
    id: ID!
    "年"
    year: Int
    "月"
    month: Int
    "主播"
    artist: User
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得訂閱紀錄"
    subscribes: [Subscribe]
    "取得單一訂閱紀錄"
    subscribe(id: ID!): Subscribe
  }
`
