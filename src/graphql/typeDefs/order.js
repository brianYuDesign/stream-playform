import { gql } from "apollo-server-express"

export default gql`
  "訂單"
  type Order {
    id: ID!
    "訂單編號"
    orderNumber: String
    "交易編號"
    tradeNumber: String
    "交易金額"
    price: Int!
    "coin數量"
    coinQuantity: Int!
    "aes"
    aes: String
    "sha"
    sha: String
    "訂單狀態"
    status: OrderStatus!
    "訂單狀態訊息"
    statusMessage: String
    "RedirectUrl"
    redirectUrl: String
    "ClientBackUrl"
    clientBackUrl: String
    "付款時間"
    payTime: DateTime
    "建立時間"
    createdAt: DateTime
    "Coin"
    coin: Coin
    "建立者"
    creator: User
    "更新者"
    updater: User
  }
  enum OrderStatus {
    CREATED
    SUCCESS
    FAIL
  }

  extend type Query {
    "取得訂單"
    orders(
      pageSize: Int
      pageNumber: Int
      filter: OrderFilterInput
    ): OrderConnection
    "取得單一訂單"
    order(id: ID): Order
  }

  extend type Mutation {
    "新增訂單"
    createOrder(input: OrderCreateInput!): Order!
    "編輯訂單"
    updateOrder(id: ID!, input: OrderUpdateInput!): Order!
    "刪除訂單"
    deleteOrder(id: ID!): ID!
  }

  type OrderConnection {
    totalPage: Int
    orders: [Order]!
  }

  input OrderFilterInput {
    "訂單編號"
    orderNumber: String
    "交易編號"
    tradeNumber: String
    "使用者帳號"
    creator: ID
    "Coin"
    coin: ID
  }

  "訂單新增欄位"
  input OrderCreateInput {
    "Coin"
    coin: ID!
    "RedirectUrl"
    redirectUrl: String!
    "ClientBackUrl"
    clientBackUrl: String!
  }

  "訂單編輯欄位"
  input OrderUpdateInput {
    "交易金額"
    price: Int
    "訂單狀態"
    status: OrderStatus
    "Coin"
    coin: ID
  }
`
