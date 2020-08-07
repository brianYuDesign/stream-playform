import { gql } from "apollo-server-express"

export default gql`
  "看板"
  type Banner {
    id: ID!
    "名稱"
    name: String!
    "圖片"
    photoUrl: String
    "起始時間"
    startTime: DateTime!
    "結束時間"
    endTime: DateTime!
    "目標網址"
    destinationUrl: URL
    "語系"
    lang: Lang!
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "前端取得看板"
    frontBanners: [Banner]
    "取得看板"
    banners: [Banner]
    "取得單一看板"
    banner(id: ID): Banner
  }

  extend type Mutation {
    "新增看板"
    createBanner(input: BannerCreateInput!): Banner!
    "編輯看板"
    updateBanner(id: ID!, input: BannerUpdateInput!): Banner!
    "刪除看板"
    deleteBanner(id: ID!): ID!
  }

  "看板新增欄位"
  input BannerCreateInput {
    "名稱"
    name: String!
    "檔案(圖片)"
    file: Upload
    "起始時間"
    startTime: DateTime!
    "結束時間"
    endTime: DateTime!
    "目標網址"
    destinationUrl: URL
    "語系"
    lang: Lang!
  }

  "看板編輯欄位"
  input BannerUpdateInput {
    "名稱"
    name: String
    "檔案(圖片)"
    file: Upload
    "起始時間"
    startTime: DateTime
    "結束時間"
    endTime: DateTime
    "目標網址"
    destinationUrl: URL
    "語系"
    lang: Lang
  }
`
