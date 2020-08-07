import { gql } from "apollo-server-express"

export default gql`
  "玩具類型"
  type ToyType {
    id: ID!
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "是否啟用"
    isEnabled: Boolean
    "玩具"
    toys: [Toy]
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    toyTypes(isEnabled: Boolean): [ToyType]
    toyType(id: ID!): ToyType
  }

  extend type Mutation {
    "新增玩具類型"
    createToyType(input: ToyTypeCreateInput!): ToyType!
    "編輯玩具類型"
    updateToyType(id: ID!, input: ToyTypeUpdateInput!): ToyType!
    "刪除玩具類型"
    deleteToyType(id: ID!): ID!
  }

  "玩具類型新增欄位"
  input ToyTypeCreateInput {
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "是否啟用"
    isEnabled: Boolean
  }

  "玩具類型編輯欄位"
  input ToyTypeUpdateInput {
    "名稱"
    name: String
    "英文名稱"
    enName: String
    "是否啟用"
    isEnabled: Boolean
  }
`
