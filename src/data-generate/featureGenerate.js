import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.feature.create({
    input: {
      featureCode: "user",
      name: "使用者管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "account",
      name: "帳號管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "dealer",
      name: "編輯公司資料"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "dealer-management",
      name: "經銷商管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "role-feature",
      name: "權限管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "feature",
      name: "功能管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "storyblock-management",
      name: "區塊管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "story-management",
      name: "貼文管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "promotion",
      name: "折扣管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "banner",
      name: "廣告管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "coin",
      name: "金流管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "reward",
      name: "獎賞管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "toy-type",
      name: "禮物類型管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "toy-management",
      name: "禮物管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "order",
      name: "訂單管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "trade",
      name: "交易紀錄管理"
    },
    user: tmpAdminUser
  })
  await helpers.feature.create({
    input: {
      featureCode: "report",
      name: "報表管理"
    },
    user: tmpAdminUser
  })

  await helpers.feature.create({
    input: {
      featureCode: "message",
      name: "聊天中心"
    },
    user: tmpAdminUser
  })
  await helpers.feature.create({
    input: {
      featureCode: "configuration",
      name: "系統設定"
    },
    user: tmpAdminUser
  })
}
