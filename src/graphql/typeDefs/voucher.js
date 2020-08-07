import { gql } from "apollo-server-express"

export default gql`
  "兌換券"
  type Voucher {
    id: ID!
    "來源"
    source: VoucherSource!
    "狀態"
    status: VoucherStatus!
    "類型"
    type: VoucherType!
    "是否有期限"
    hasDeadline: Boolean
    "年"
    year: Int
    "月"
    month: Int
    "擁有者"
    owner: User!
    "限定主播"
    artist: User
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  enum VoucherSource {
    "追蹤"
    FOLLOWING
    "訂閱"
    SUBSCIBING
    "促銷活動"
    PROMOTION
    "禮物"
    GIFT
  }

  enum VoucherStatus {
    ACTIVED
    USED
    EXPIRED
  }

  enum VoucherType {
    UNLOCK_CHAT
    UNLOCK_STORY
  }

  extend type Query {
    "取得行為與主播兌換券"
    artistVouchers(artist: ID, type: VoucherType): [Voucher]
    "取得兌換券"
    vouchers: [Voucher]
    "取得單一兌換券"
    voucher(id: ID!): Voucher
  }

  extend type Mutation {
    "新增兌換券"
    createVoucher(input: VoucherCreateInput!): Voucher!
    "編輯兌換券"
    updateVoucher(id: ID!, input: VoucherUpdateInput!): Voucher!
    "刪除兌換券"
    deleteVoucher(id: ID!): ID!
  }

  "兌換券新增欄位"
  input VoucherCreateInput {
    "來源"
    source: VoucherSource!
    "狀態"
    status: VoucherStatus!
    "類型"
    type: VoucherType!
    "年"
    year: Int!
    "月"
    month: Int!
    "擁有者"
    owner: ID!
    "限定主播"
    artist: ID!
  }

  "兌換券編輯欄位"
  input VoucherUpdateInput {
    "來源"
    source: VoucherSource!
    "狀態"
    status: VoucherStatus!
    "年"
    year: Int
    "月"
    month: Int
    "擁有者"
    owner: ID
    "限定主播"
    artist: ID
  }
`
