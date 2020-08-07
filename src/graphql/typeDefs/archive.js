import { gql } from "apollo-server-express"

export default gql`
  "成就"
  type Archive {
    "數量"
    total: Int
    "貼文"
    stories: [Story]
    "主播"
    artist: User
  }

  type ArchiveConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    archives: [Archive]!
  }

  extend type Query {
    archives(pageSize: Int, after: String): ArchiveConnection
    archive(artist: ID!): Archive
  }
`
