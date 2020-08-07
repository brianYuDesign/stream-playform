import { gql } from "apollo-server-express"

export default gql`
  "使用者"
  type User {
    id: ID!
    "使用者uid"
    uid: String!
    "信箱"
    email: EmailAddress
    "名稱"
    name: String
    "電話(+886912345678)"
    phoneNumber: String
    "性別"
    gender: Gender
    "性取向"
    sexualOrientation: [Gender]
    "生日"
    birthday: DateTime
    "頭像"
    avatar: String
    "背景圖片"
    background: String
    "個人描述"
    description: String
    "推薦碼"
    promotionCode: String
    "是否啟用"
    isEnabled: Boolean
    "是否可以約炮"
    isDateabled: Boolean
    "是否在線上"
    isOnline: Boolean
    "是否已更改Uid"
    isUidModified: Boolean
    "是否更改密碼"
    isPasswordNeedToChange: Boolean
    "Coin"
    coin: Int
    "接收者email"
    recipientEmail: EmailAddress
    "發票類型"
    invoiceType: InvoiceType
    "發票買受人"
    invoiceBuyer: String
    "發票買受人電話"
    invoicePhoneNumber: String
    "發票買受人地址"
    invoiceAddress: String
    "角色功能"
    roleFeature: RoleFeature!
    "經銷商"
    dealer: Dealer
    "可代理發言的主播"
    manageArtists: [User]
    "使用者Badge"
    badges: [Badge]
    "擁有的優惠券清單"
    vouchers: [Voucher]
    "解鎖動態"
    unlockStories: [Story]
    "追蹤中的使用者"
    following(status: FollowStatus): [Following]
    "誰目前追蹤我"
    followers: [User]
    "訂閱中的使用者"
    subscribing(status: SubscribeStatus): [Subscribing]
    "誰目前訂閱我"
    subscribers: [User]
    "封鎖中的使用者"
    blocking(status: BlockStatus): [Blocking]
    "誰目前封鎖我"
    blockers: [User]
    "訂單記錄"
    orders: [Order]
    "消耗紀錄"
    consumeHistories: [ConsumeHistory]
    "個人日誌"
    records: [Record]
    "主播收益"
    artistConsumeHistories: [ConsumeHistory]
    "當月收益鑽石"
    monthOfIncome: Int
    "推薦人"
    referrer: User
    "建立者"
    creator: User
    "更新者"
    updater: User
  }

  extend type Query {
    "搜尋主播使用者"
    searchArtists(
      pageSize: Int
      after: String
      filter: UserFilterInput
    ): UserConnection!
    "搜尋經銷商使用者"
    searchDealerUsers(
      pageSize: Int
      after: String
      filter: UserFilterInput
    ): UserConnection!
    "搜尋可約炮主播"
    searchDateableArtists(
      pageSize: Int
      after: String
      filter: UserFilterInput
    ): UserConnection!
    "搜尋使用者"
    searchUsers(
      pageSize: Int
      after: String
      filter: UserFilterInput
    ): UserConnection!
    "取得主播"
    artists(pageSize: Int, after: String): UserConnection!
    "取得使用者"
    users(
      pageSize: Int
      pageNumber: Int
      filter: UserFilterInput
    ): UserConnection!
    "取得單一使用者"
    user(id: ID!): User
    "我"
    me: User
  }

  extend type Mutation {
    "新增使用者"
    createUser(input: UserCreateInput!): User
    "編輯使用者"
    updateUser(id: ID!, input: UserUpdateInput!): User
    "前端編輯個人資訊"
    updateUserInfo(input: UserInfoUpdateInput!): User
    "前端編輯uid"
    updateUserUid(input: UserUidUpdateInput!): User
    "追蹤/取消追蹤 使用者"
    followingUser(target: ID!, status: FollowStatus!): User
    "訂閱/取消訂閱 使用者"
    subscribingUser(target: ID!, status: SubscribeStatus!): User
    "封鎖/取消封鎖 使用者"
    blockingUser(target: ID!, status: BlockStatus!): User
  }

  enum FollowStatus {
    FOLLOW
    UNFOLLOW
  }

  enum SubscribeStatus {
    SUBSCRIBE
    UNSUBSCRIBE
  }

  enum BlockStatus {
    BLOCK
    UNBLOCK
  }

  enum Gender {
    MALE
    FEMALE
  }

  enum InvoiceType {
    PERSONAL
    LOVE
  }

  type Following {
    target: User
    status: FollowStatus
    followAt: DateTime
    unfollowAt: DateTime
  }

  type Subscribing {
    target: User
    status: SubscribeStatus
    subscribeAt: DateTime
    unsubscribeAt: DateTime
  }

  type Blocking {
    target: User
    status: BlockStatus
    blockAt: DateTime
    unblockAt: DateTime
  }

  type UserConnection {
    totalPage: Int
    totalCount: Int
    cursor: String
    hasMore: Boolean
    users: [User]!
  }

  type Badge {
    type: RankingType
    period: RankingPeriod
    rank: Int
  }

  "搜尋使用者欄位"
  input UserFilterInput {
    "uid"
    uid: String
    "推廣碼"
    promotionCode: String
    "經銷商"
    dealer: ID
    "角色功能"
    roleFeature: ID
    "推薦人"
    referrer: ID
  }

  input UserCreateInput {
    "名稱"
    name: String
    "信箱"
    email: EmailAddress!
    "電話(+886912345678)"
    phoneNumber: String!
    "個人描述"
    description: String
    "性別"
    gender: Gender
    "生日"
    birthday: DateTime
    "角色功能"
    roleFeature: ID!
    "是否啟用"
    isEnabled: Boolean
    "是否可以約炮"
    isDateabled: Boolean
    "經銷商"
    dealer: ID
    "可代理發言的主播"
    manageArtists: [ID]
  }

  input UserUpdateInput {
    "電話(+886912345678)"
    phoneNumber: String
    "是否啟用"
    isEnabled: Boolean
    "是否可以約炮"
    isDateabled: Boolean
    "原始密碼"
    originPassword: String
    "新密碼"
    newPassword: String
    "個人描述"
    description: String
    "性別"
    gender: Gender
    "生日"
    birthday: DateTime
    "角色功能"
    roleFeature: ID
    "經銷商"
    dealer: ID
    "可代理發言的主播"
    manageArtists: [ID]
  }

  input UserInfoUpdateInput {
    "原始密碼"
    originPassword: String
    "新密碼"
    newPassword: String
    "個人描述"
    description: String
    "性別"
    gender: Gender
    "性取向"
    sexualOrientation: [Gender]
    "接收者email"
    recipientEmail: EmailAddress
    "生日"
    birthday: DateTime
    "檔案(頭貼)"
    avatarFile: Upload
    "檔案(背景)"
    backgroundFile: Upload
    "發票類型"
    invoiceType: InvoiceType
    "發票買受人"
    invoiceBuyer: String
    "發票買受人電話"
    invoicePhoneNumber: String
    "發票買受人地址"
    invoiceAddress: String
  }

  input UserUidUpdateInput {
    "使用者uid"
    uid: String!
  }
`
