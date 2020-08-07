import { gql } from "apollo-server-express"

export default gql`
  "角色功能"
  type RoleFeature {
    id: ID!
    "名稱"
    name: String!
    "顯示名稱"
    displayName: String
    "功能"
    features: [Feature]
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得角色功能"
    roleFeatures: [RoleFeature]
    "取得單一角色功能"
    roleFeature(id: ID!): RoleFeature
  }

  extend type Mutation {
    "新增角色功能"
    createRoleFeature(input: RoleFeatureCreateInput!): RoleFeature!
    "編輯角色功能"
    updateRoleFeature(id: ID!, input: RoleFeatureUpdateInput!): RoleFeature!
    "刪除角色功能"
    deleteRoleFeature(id: ID!): ID!
  }

  "角色功能新增欄位"
  input RoleFeatureCreateInput {
    "名稱"
    name: String!
    "顯示名稱"
    displayName: String
    "功能"
    features: [ID]
  }

  "角色功能編輯欄位"
  input RoleFeatureUpdateInput {
    "名稱"
    name: String!
    "顯示名稱"
    displayName: String
    "功能"
    features: [ID]
  }
`
