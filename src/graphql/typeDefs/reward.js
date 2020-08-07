import { gql } from "apollo-server-express"

export default gql`
  "獎賞"
  type Reward {
    id: ID!
    "類型"
    type: RewardType!
    "獎勵"
    reward: PositiveInt!
    "需要多少門檻金額"
    requiredPrice: PositiveInt
    "描述"
    description: String
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得獎賞"
    rewards: [Reward]
    "取得單一獎賞"
    reward(id: ID!): Reward
  }

  extend type Mutation {
    "新增獎賞"
    createReward(input: RewardCreateInput!): Reward!
    "編輯獎賞"
    updateReward(id: ID!, input: RewardUpdateInput!): Reward!
    "刪除獎賞"
    deleteReward(id: ID!): ID!
  }

  enum RewardType {
    COIN
    VOUCHER
  }

  "獎賞新增欄位"
  input RewardCreateInput {
    "類型"
    type: RewardType!
    "獎勵"
    reward: PositiveInt!
    "需要多少門檻金額"
    requiredPrice: PositiveInt
    "描述"
    description: String
  }

  "獎賞編輯欄位"
  input RewardUpdateInput {
    "類型"
    type: RewardType
    "獎勵"
    reward: PositiveInt
    "需要多少門檻金額"
    requiredPrice: PositiveInt
    "描述"
    description: String
  }
`
