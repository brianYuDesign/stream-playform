import { gql } from "apollo-server-express"

export default gql`
  "經銷商"
  type Dealer {
    id: ID!
    "統一編號"
    ban: String!
    "負責人"
    owner: String!
    "名稱"
    name: String!
    "公司信箱"
    email: EmailAddress!
    "公司地址"
    address: String!
    "電話"
    phoneNumber: String!
    "合約"
    contractUrl: String
    "獲利切分"
    profitPercentSetting: Int
    "是否啟用"
    isEnabled: Boolean!
    "系統使用者"
    systemUser: User
    "主播"
    artists: [User]
    "消耗紀錄"
    consumeHistories: [ConsumeHistory]
    "當月收益鑽石"
    monthOfIncome: Int
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得經銷商"
    dealers: [Dealer]
    "取得單一經銷商"
    dealer(id: ID): Dealer
  }

  extend type Mutation {
    "新增經銷商"
    createDealer(input: DealerCreateInput!): Dealer
    "編輯經銷商"
    updateDealer(id: ID!, input: DealerUpdateInput!): Dealer
  }

  input DealerCreateInput {
    "統一編號"
    ban: String!
    "負責人"
    owner: String!
    "名稱"
    name: String!
    "公司信箱"
    email: EmailAddress!
    "公司地址"
    address: String!
    "電話"
    phoneNumber: String!
    "檔案(合約)"
    file: Upload
    "獲利切分"
    profitPercentSetting: Int
    "是否啟用"
    isEnabled: Boolean
    "系統使用者"
    systemUser: ID
  }

  input DealerUpdateInput {
    "統一編號"
    ban: String
    "負責人"
    owner: String
    "名稱"
    name: String
    "公司信箱"
    email: EmailAddress
    "公司地址"
    address: String
    "電話"
    phoneNumber: String
    "檔案(合約)"
    file: Upload
    "獲利切分"
    profitPercentSetting: Int
    "是否啟用"
    isEnabled: Boolean
    "系統使用者"
    systemUser: ID
  }
`
