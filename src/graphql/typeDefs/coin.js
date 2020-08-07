import { gql } from "apollo-server-express"

export default gql`
  "Coin"
  type Coin {
    id: ID!
    "數量"
    quantity: PositiveInt!
    "價格"
    price: PositiveInt!
    "是否啟用"
    isEnabled: Boolean!
    "語系"
    lang: Lang!
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "前端Coin"
    frontCoins(lang: Lang!): [Coin]
    "取得Coin"
    coins: [Coin]
    "取得單一Coin"
    coin(id: ID): Coin
  }

  extend type Mutation {
    "新增Coin"
    createCoin(input: CoinCreateInput!): Coin!
    "編輯Coin"
    updateCoin(id: ID!, input: CoinUpdateInput!): Coin!
  }

  "Coin新增欄位"
  input CoinCreateInput {
    "數量"
    quantity: PositiveInt!
    "價格"
    price: PositiveInt!
    "是否啟用"
    isEnabled: Boolean
    "語系"
    lang: Lang!
  }

  "Coin編輯欄位"
  input CoinUpdateInput {
    "數量"
    quantity: PositiveInt
    "價格"
    price: PositiveInt
    "是否啟用"
    isEnabled: Boolean
    "語系"
    lang: Lang
  }
`
