import { gql } from "apollo-server-express"

export default gql`
  "玩具"
  type Toy {
    id: ID!
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "玩具類型"
    toyType: ToyType!
    "圖片"
    photoUrl: String
    "coin數量"
    necessaryCoin: PositiveInt!
    "建立者"
    creator: User
    "更新者"
    updater: User
    "是否啟用"
    isEnabled: Boolean
  }

  extend type Query {
    "取得玩具"
    toys: [Toy]
    "取得單一玩具"
    toy(id: ID!): Toy
  }

  extend type Mutation {
    "新增玩具"
    createToy(input: ToyCreateInput!): Toy!
    "編輯玩具"
    updateToy(id: ID!, input: ToyUpdateInput!): Toy!
    "刪除玩具"
    deleteToy(id: ID!): ID!
  }

  "玩具新增欄位"
  input ToyCreateInput {
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "玩具類型"
    toyType: ID!
    "檔案(圖片)"
    file: Upload
    "coin數量"
    necessaryCoin: PositiveInt!
    "是否啟用"
    isEnabled: Boolean
  }

  "玩具編輯欄位"
  input ToyUpdateInput {
    "名稱"
    name: String
    "英文名稱"
    enName: String
    "玩具類型"
    toyType: ID
    "檔案(圖片)"
    file: Upload
    "coin數量"
    necessaryCoin: PositiveInt
    "是否啟用"
    isEnabled: Boolean
  }
`
