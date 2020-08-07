import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.storyBlock.create({
    input: {
      name: "大家都在看",
      enName: "Everyone's Ogling",
      order: 1,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "熱門解鎖",
      enName: "Trending",
      order: 2,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "最新上傳",
      enName: "They're New",
      order: 3,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "北區",
      enName: "North District",
      order: 4,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "中區",
      enName: "Mid District",
      order: 5,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "南區",
      enName: "South District",
      order: 6,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "東區",
      enName: "East District",
      order: 7,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "台北",
      enName: "Taipei",
      parent: (await helpers.storyBlock.getOne({ name: "北區" })).id,
      order: 8,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "新北",
      enName: "New Taipei",
      parent: (await helpers.storyBlock.getOne({ name: "北區" })).id,
      order: 9,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "桃園",
      enName: "Taoyuan",
      parent: (await helpers.storyBlock.getOne({ name: "北區" })).id,
      order: 10,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "基隆",
      enName: "Keelung",
      parent: (await helpers.storyBlock.getOne({ name: "北區" })).id,
      order: 11,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "新竹",
      enName: "Hsinchu",
      parent: (await helpers.storyBlock.getOne({ name: "北區" })).id,
      order: 12,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "苗栗",
      enName: "Miaoli",
      parent: (await helpers.storyBlock.getOne({ name: "中區" })).id,
      order: 13,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "台中",
      enName: "Taichung",
      parent: (await helpers.storyBlock.getOne({ name: "中區" })).id,
      order: 14,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "彰化",
      enName: "Zhanghua",
      parent: (await helpers.storyBlock.getOne({ name: "中區" })).id,
      order: 15,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "南投",
      enName: "Nantou",
      parent: (await helpers.storyBlock.getOne({ name: "中區" })).id,
      order: 16,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "雲林",
      enName: "Yunlin",
      parent: (await helpers.storyBlock.getOne({ name: "中區" })).id,
      order: 17,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "嘉義",
      enName: "Jiayi",
      parent: (await helpers.storyBlock.getOne({ name: "南區" })).id,
      order: 18,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "台南",
      enName: "Tainan",
      parent: (await helpers.storyBlock.getOne({ name: "南區" })).id,
      order: 19,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "高雄",
      enName: "Kaohsiung",
      parent: (await helpers.storyBlock.getOne({ name: "南區" })).id,
      order: 20,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "屏東",
      enName: "Pingdong",
      parent: (await helpers.storyBlock.getOne({ name: "南區" })).id,
      order: 21,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "澎湖",
      enName: "Penghu",
      parent: (await helpers.storyBlock.getOne({ name: "南區" })).id,
      order: 21,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "外島區",
      enName: "Outside District",
      order: 22,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "金門",
      enName: "Kinmen",
      parent: (await helpers.storyBlock.getOne({ name: "外島區" })).id,
      order: 23,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "馬祖",
      enName: "Matsu",
      parent: (await helpers.storyBlock.getOne({ name: "外島區" })).id,
      order: 24,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "宜蘭",
      enName: "Yilan",
      parent: (await helpers.storyBlock.getOne({ name: "東區" })).id,
      order: 25,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "花蓮",
      enName: "Hualien",
      parent: (await helpers.storyBlock.getOne({ name: "東區" })).id,
      order: 26,
      isEnabled: true
    },
    user: tmpAdminUser
  })

  await helpers.storyBlock.create({
    input: {
      name: "台東",
      enName: "Taitung",
      parent: (await helpers.storyBlock.getOne({ name: "東區" })).id,
      order: 27,
      isEnabled: true
    },
    user: tmpAdminUser
  })
}
