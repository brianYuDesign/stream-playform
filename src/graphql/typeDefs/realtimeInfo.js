import { gql } from "apollo-server-express"

export default gql`
  extend type Subscription {
    "線上即時資訊"
    realtimeInfo: RealtimeInfo
  }

  type RealtimeInfo {
    "線上人數"
    onlineUserCount: Int!
    "解鎖聊天數"
    unlockChatCount: Int!
    "免費限時動態"
    freeStoryCount: Int!
  }
`
