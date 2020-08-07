import { gql } from "apollo-server-express"

export default gql`
  "組態參數"
  type Configuration {
    "加入好友免費聊天次數"
    followingRewardOfUnlockChat: PositiveInt
    "訂閱的費用"
    subscribeingCoin: PositiveInt
    "預設聊天解鎖費用"
    chatCoin: PositiveInt
    "訂閱後解鎖貼文兌換卷"
    subscribingRewardOfUnlockStory: PositiveInt
    "訂閱後解鎖聊天兌換卷"
    subscribingRewardOfUnlockChat: PositiveInt
    # "發送郵件信箱"
    # sendEmailFrom: String
    # "系統郵件信箱"
    # systemEmailAddress: String
    # "系統郵件密碼"
    # systemEmailPassword: String
    "置頂貼文數"
    pinnedStoryLength: PositiveInt
  }

  input ConfigurationUpdateInput {
    "加入好友免費聊天次數"
    followingRewardOfUnlockChat: PositiveInt!
    "訂閱的費用"
    subscribeingCoin: PositiveInt!
    "預設聊天解鎖費用"
    chatCoin: PositiveInt!
    "訂閱後解鎖貼文兌換卷"
    subscribingRewardOfUnlockStory: PositiveInt!
    "訂閱後解鎖聊天兌換卷"
    subscribingRewardOfUnlockChat: PositiveInt!
    # "發送郵件信箱"
    # sendEmailFrom: String!
    # "系統郵件信箱"
    # systemEmailAddress: String!
    # "系統郵件密碼"
    # systemEmailPassword: String!
    "置頂貼文數"
    pinnedStoryLength: PositiveInt
  }

  extend type Query {
    "取得組態參數"
    configuration: Configuration!
  }

  extend type Mutation {
    "編輯組態參數"
    updateConfiguration(input: ConfigurationUpdateInput!): Configuration!
  }
`
