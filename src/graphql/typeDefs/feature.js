import { gql } from "apollo-server-express"

export default gql`
  "功能資訊"
  type Feature {
    id: ID!
    "名稱"
    name: String!
    "元件名稱"
    featureCode: String!
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得功能資訊"
    features: [Feature]
    "取得單一功能資訊"
    feature(id: ID): Feature
  }

  extend type Mutation {
    "新增功能資訊"
    createFeature(input: FeatureCreateInput!): Feature!
    "編輯功能資訊"
    updateFeature(id: ID!, input: FeatureUpdateInput!): Feature!
    "刪除功能資訊"
    deleteFeature(id: ID!): ID!
  }

  "功能資訊新增欄位"
  input FeatureCreateInput {
    "名稱"
    name: String!
    "元件名稱"
    featureCode: String!
  }

  "功能資訊編輯欄位"
  input FeatureUpdateInput {
    "名稱"
    name: String!
    "元件名稱"
    featureCode: String!
  }
`
