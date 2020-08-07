import { gql } from "apollo-server-express"

export default gql`
  "動態訊息提醒"
  type StoryNotification {
    id: ID!
    "所有訊息"
    latestStory: Story
    "已讀使用者"
    readUserList: [User]
    "主播"
    creator: User
    "使用者未讀"
    hasReadStory: Boolean
  }

  type StoryNotificationConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    storyNotifications: [StoryNotification]!
  }

  extend type Query {
    "追蹤主播最新的動態提醒清單"
    storyNotifications(
      pageSize: Int
      after: String
    ): StoryNotificationConnection
  }

  extend type Mutation {
    "讀取主播最新動態"
    readStoryNotification(id: ID!): StoryNotification
  }
`
