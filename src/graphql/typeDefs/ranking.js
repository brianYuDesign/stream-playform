import { gql } from "apollo-server-express"

export default gql`
  type Ranking {
    "主播"
    user: User
    "排名"
    rank: Int
    "寶石數量"
    coin: Int
    "次數"
    quantity: Int
  }
  type RankingConnection {
    totalCount: Int
    cursor: String
    hasMore: Boolean!
    rankings: [Ranking]
  }

  extend type Query {
    rankings(
      pageSize: Int
      after: String
      filter: SearchRankFilterInput!
    ): RankingConnection
  }

  enum RankingType {
    "總排行榜"
    ALL
    "禮物榜"
    SEND_TOY
    "聊天榜"
    UNLOCK_CHAT
    "解鎖榜"
    UNLOCK_STORY
  }

  enum RankingPeriod {
    "日排行"
    ONEDAY
    "週排行"
    ONEWEEK
    "月排行"
    ONEMONTH
  }

  input SearchRankFilterInput {
    type: RankingType!
    period: RankingPeriod!
    isClient: Boolean
  }
`
