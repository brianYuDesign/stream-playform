import { gql } from "apollo-server-express"

export default gql`
  "動態標籤"
  type StoryTag {
    id: ID!
    "名稱"
    name: String!
    "文章數量"
    storyLength: Int
    "動態"
    stories: [Story]
    "縮圖"
    thumbnailUrl: String
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "前端搜尋標籤"
    searchStoryTags(
      pageSize: Int
      after: String
      filter: SearchStoryTagFilterInput
    ): StoryTagConnection
    "取得動態標籤"
    storyTags: [StoryTag]
    "取得單一動態標籤"
    storyTag(id: ID): StoryTag
  }

  type StoryTagConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    storyTags: [StoryTag]!
  }

  extend type Mutation {
    "新增動態標籤"
    createStoryTag(input: StoryTagCreateInput!): StoryTag!
  }

  input SearchStoryTagFilterInput {
    "名稱"
    name: String!
  }

  "動態標籤新增欄位"
  input StoryTagCreateInput {
    "名稱"
    name: String!
  }
`
