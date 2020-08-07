import { gql } from "apollo-server-express"

export default gql`
  "經銷商統計報表"
  type DealerReport {
    "主播"
    artist: User
    "收禮統計"
    sendToyCoin: Int
    "聊天統計"
    unlockChatCoin: Int
    "解鎖統計"
    unlockStoryCoin: Int
    "訂閱統計"
    subscribeCoin: Int
    "總計"
    totalCoin: Int
  }

  type DealerReportConnection {
    totalPage: Int
    dealerReports: [DealerReport]!
    totalIncome: Int
  }

  extend type Query {
    "取得經銷商統計報表"
    dealerReports(
      pageSize: Int
      pageNumber: Int
      filter: DealerReportFilterInput
    ): DealerReportConnection
  }

  input DealerReportFilterInput {
    "經銷商"
    dealer: ID
    "年"
    year: Int
    "月"
    month: Int
  }
`
