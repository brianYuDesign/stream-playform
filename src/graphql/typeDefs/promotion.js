import { gql } from "apollo-server-express"

export default gql`
  "活動促銷"
  type Promotion {
    id: ID!
    "起始時間"
    startTime: DateTime!
    "結束時間"
    endTime: DateTime!
    "標題"
    title: String!
    "內容"
    content: String!
    "語系"
    lang: Lang!
    "獎賞"
    reward: Reward
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "前端活動促銷"
    frontPromotions: [Promotion]
    "取得活動促銷"
    promotions: [Promotion]
    "取得單一活動促銷"
    promotion(id: ID!): Promotion
  }

  extend type Mutation {
    "新增活動促銷"
    createPromotion(input: PromotionCreateInput!): Promotion!
    "編輯活動促銷"
    updatePromotion(id: ID!, input: PromotionUpdateInput!): Promotion!
    "刪除活動促銷"
    deletePromotion(id: ID!): ID!
  }

  "活動促銷新增欄位"
  input PromotionCreateInput {
    "起始時間"
    startTime: DateTime!
    "結束時間"
    endTime: DateTime!
    "標題"
    title: String!
    "內容"
    content: String!
    "語系"
    lang: Lang!
    "獎賞"
    reward: ID
  }

  "活動促銷編輯欄位"
  input PromotionUpdateInput {
    "起始時間"
    startTime: DateTime
    "結束時間"
    endTime: DateTime
    "標題"
    title: String
    "內容"
    content: String
    "語系"
    lang: Lang
    "獎賞"
    reward: ID
  }
`
