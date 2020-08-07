import { gql } from "apollo-server-express"

export default gql`
  extend type Subscription {
    "追蹤主播的貼文提醒"
    newPublishedStoryOfFollowArtist: Story
  }
  "動態"
  type Story {
    id: ID!
    "動態編號"
    number: String!
    "動態類型"
    type: StoryType!
    "狀態"
    status: StoryStatus!
    "內容"
    content: String!
    # "下載連結"
    # downloadUrl: String
    "資源連結"
    resourceUrl(isPreview: Boolean): String
    "縮圖連結"
    thumbnailUrl: String
    "縮圖連結-小"
    smallThumbnailUrl: String
    "是否置頂"
    isPinned: Boolean!
    "起始時間"
    publishTime: DateTime
    "結束時間"
    endTime: DateTime
    "需要解鎖Coin"
    necessaryCoin: Int!
    "灌水數"
    fakeViews: Int
    "是否已經購買"
    isPurchased: Boolean
    "動態區塊"
    storyBlock: StoryBlock
    "標籤"
    storyTags: [StoryTag]
    "建立者"
    creator: User
    "更新者"
    updater: User
    "建立時間"
    createdAt: DateTime
    "更新時間"
    updatedAt: DateTime
    "解鎖數"
    unlockLength: Int
    "解鎖coin總和"
    incomeCoin: Int
    "瀏覽次數"
    views: Int
    "前一則"
    prevStory(filter: prevStoryFilterInput): Story
    "下一則"
    nextStory(filter: nextStoryFilterInput): Story
    "最後檔案上傳時間"
    lastUploadTime: DateTime
  }

  input prevStoryFilterInput {
    "文章標籤"
    storyTags: ID
    "文章區塊"
    storyBlock: ID
    "主播"
    creator: ID
    "是否限時免費"
    isFree: Boolean
    "是否已購"
    isArchived: Boolean
  }

  input nextStoryFilterInput {
    "文章標籤"
    storyTags: ID
    "文章區塊"
    storyBlock: ID
    "主播"
    creator: ID
    "是否限時免費"
    isFree: Boolean
    "是否已購"
    isArchived: Boolean
  }

  type StoryConnection {
    totalPage: Int
    totalCount: Int
    cursor: String
    hasMore: Boolean
    stories: [Story]!
  }

  enum StoryStatus {
    CREATED
    PUBLISHED
    BLOCKED
  }

  enum StoryType {
    "圖片"
    PHOTO
    "影片"
    VIDEO
  }

  extend type Query {
    "限時免費動態"
    freeStories(pageSize: Int, after: String): StoryConnection
    "置頂動態"
    pinnedStories: [Story]
    "前端搜尋動態"
    searchStories(
      pageSize: Int
      after: String
      filter: SearchStoryFilterInput
    ): StoryConnection
    "主播動態清單"
    artistStories(pageSize: Int, after: String, artist: ID!): StoryConnection
    "標籤動態清單"
    storyTagStories(
      pageSize: Int
      after: String
      storyTag: ID!
    ): StoryConnection
    storyBlockStories(
      pageSize: Int
      after: String
      storyBlock: ID!
    ): StoryConnection
    "前端取得所有動態"
    frontStories(pageSize: Int, after: String): StoryConnection
    "主播取得個人動態"
    ownStories(pageSize: Int, after: String): StoryConnection
    "取得所有動態"
    stories(
      filter: StoriesFilterInput
      pageSize: Int
      pageNumber: Int
    ): StoryConnection
    "取得單一動態"
    story(id: ID!): Story
  }

  extend type Mutation {
    "新增動態"
    createStory(input: StoryCreateInput!): Story!
    "編輯動態"
    updateStory(id: ID!, input: StoryUpdateInput!): Story!
    "刪除動態"
    deleteStory(id: ID!): ID!
  }

  input SearchStoryFilterInput {
    "內容"
    content: String
  }

  input StoriesFilterInput {
    "內容"
    content: String
    "動態類型"
    type: String
    "狀態"
    status: String
    "是否置頂"
    isPinned: Boolean
    "主播"
    creator: ID
  }

  "動態新增欄位"
  input StoryCreateInput {
    "動態類型"
    type: StoryType!
    "內容"
    content: String!
    "檔案(圖片or影片)"
    file: Upload
    "需要解鎖Coin"
    necessaryCoin: Int
    "灌水數"
    fakeViews: Int
    "動態區塊"
    storyBlock: ID
    "標籤"
    storyTags: [ID]
    "標籤名稱"
    storyTagNames: [String]
    "主播"
    creator: ID
  }

  "動態編輯欄位"
  input StoryUpdateInput {
    "動態類型"
    type: StoryType
    "狀態"
    status: StoryStatus
    "內容"
    content: String
    "起始時間"
    publishTime: DateTime
    "結束時間"
    endTime: DateTime
    "縮圖"
    thumbnail: Upload
    "縮圖-小"
    smallThumbnail: Upload
    "檔案(圖片or影片)"
    file: Upload
    "是否置頂"
    isPinned: Boolean
    "需要解鎖Coin"
    necessaryCoin: Int
    "灌水數"
    fakeViews: Int
    "動態區塊"
    storyBlock: ID
    "標籤"
    storyTags: [ID]
    "新標籤名稱"
    storyTagNames: [String]
    "主播"
    creator: ID
  }
`
