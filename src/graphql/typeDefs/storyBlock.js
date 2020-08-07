import { gql } from "apollo-server-express"

export default gql`
  "動態區塊"
  type StoryBlock {
    id: ID!
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "順序"
    order: Int
    "是否啟用"
    isEnabled: Boolean
    "動態數量"
    storyLength: Int
    "父層ID"
    parentId: ID
    "父層"
    parent: StoryBlock
    "子層"
    children: [StoryBlock]
    "動態"
    stories: [Story]
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "取得畫面動態區塊"
    frontStoryBlocks: [StoryBlock]
    "取得動態區塊"
    storyBlocks: [StoryBlock]
    "取得單一動態區塊"
    storyBlock(id: ID!): StoryBlock
  }

  extend type Mutation {
    "新增動態區塊"
    createStoryBlock(input: StoryBlockCreateInput!): StoryBlock!
    "編輯動態區塊"
    updateStoryBlock(id: ID!, input: StoryBlockUpdateInput!): StoryBlock!
    "群組編輯動態區塊"
    updateStoryBlocks(input: [StoryBlocksUpdateInput]): [StoryBlock]
    "刪除動態區塊"
    deleteStoryBlock(id: ID!): ID!
  }

  "動態區塊新增欄位"
  input StoryBlockCreateInput {
    "名稱"
    name: String!
    "英文名稱"
    enName: String!
    "是否啟用"
    isEnabled: Boolean
    "順序"
    order: Int
    "父層"
    parent: ID
  }

  "動態區塊編輯欄位"
  input StoryBlockUpdateInput {
    "名稱"
    name: String
    "英文名稱"
    enName: String
    "是否啟用"
    isEnabled: Boolean
    "順序"
    order: Int
    "父層"
    parent: ID
  }

  "動態區塊群組編輯欄位"
  input StoryBlocksUpdateInput {
    "ID"
    id: ID
    "名稱"
    name: String
    "英文名稱"
    enName: String
    "是否啟用"
    isEnabled: Boolean
    "順序"
    order: Int
    "父層"
    parent: ID
  }
`
