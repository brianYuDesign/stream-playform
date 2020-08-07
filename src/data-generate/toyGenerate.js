import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.toy.create({
    input: {
      name: "刷一排HI",
      enName: "hi-linlinbaby",
      toyType: (await helpers.toyType.getOne({ name: "聖誕主播" })).id,
      necessaryCoin: 3999,
      photoUrl: "toys/Artist/i_want_feifeibebe.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "刷一排影片",
      enName: "linlinbaby-story",
      toyType: (await helpers.toyType.getOne({ name: "聖誕主播" })).id,
      necessaryCoin: 9999,
      photoUrl: "toys/Artist/mikeybaby_blow_job.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "刷一排VIP",
      enName: "linlinbaby-vip",
      toyType: (await helpers.toyType.getOne({ name: "聖誕主播" })).id,
      necessaryCoin: 10000,
      photoUrl: "toys/Artist/queenagirl_sucking_nipple.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "性感皇后",
      enName: "sexy_queenagirl",
      toyType: (await helpers.toyType.getOne({ name: "性感主播" })).id,
      necessaryCoin: 3999,
      photoUrl: "toys/Artist/sexy_queenagirl.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "吸舔皇后",
      enName: "queenagirl_sucking_nipple",
      toyType: (await helpers.toyType.getOne({ name: "性感主播" })).id,
      necessaryCoin: 9999,
      photoUrl: "toys/Artist/queenagirl_sucking_nipple.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "落落寶貝",
      enName: "rorobaby_squirting",
      toyType: (await helpers.toyType.getOne({ name: "性感主播" })).id,
      necessaryCoin: 10000,
      photoUrl: "toys/Artist/rorobaby_squirting.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "貓耳",
      enName: "Cat year",
      toyType: (await helpers.toyType.getOne({ name: "情趣玩具" })).id,
      necessaryCoin: 69,
      photoUrl: "toys/SexyToy/cat-ears.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "跳蛋",
      enName: "V egg",
      toyType: (await helpers.toyType.getOne({ name: "情趣玩具" })).id,
      necessaryCoin: 6999,
      photoUrl: "toys/SexyToy/vibrating-eggs.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "按摩棒",
      enName: "Rotor",
      toyType: (await helpers.toyType.getOne({ name: "情趣玩具" })).id,
      necessaryCoin: 6999,
      photoUrl: "toys/SexyToy/pink-rotor.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "酷炫跑車",
      enName: "Fantastic car",
      toyType: (await helpers.toyType.getOne({ name: "豪華寶貝" })).id,
      necessaryCoin: 666,
      photoUrl: "toys/LuxuryBaby/fantastic-car.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "豪華遊艇",
      enName: "Luxury yacht",
      toyType: (await helpers.toyType.getOne({ name: "豪華寶貝" })).id,
      necessaryCoin: 8888,
      photoUrl: "toys/LuxuryBaby/luxury-yacht.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "私人飛機",
      enName: "Airplane",
      toyType: (await helpers.toyType.getOne({ name: "豪華寶貝" })).id,
      necessaryCoin: 666666,
      photoUrl: "toys/LuxuryBaby/airplane.png"
    },
    user: tmpAdminUser
  })

  await helpers.toy.create({
    input: {
      name: "獨家太空船",
      enName: "Spaceship",
      toyType: (await helpers.toyType.getOne({ name: "豪華寶貝" })).id,
      necessaryCoin: 888888,
      photoUrl: "toys/LuxuryBaby/spaceship.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "生日快樂",
      enName: "bithday",
      toyType: await helpers.toyType.getOne({ name: "生日禮物" }),
      necessaryCoin: 999,
      photoUrl: "toys/Birthday/happy-birthday-999.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "生日快樂",
      enName: "bithday",
      toyType: await helpers.toyType.getOne({ name: "生日禮物" }),
      necessaryCoin: 9999,
      photoUrl: "toys/Birthday/happy-birthday-9999.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "生日快樂",
      enName: "bithday",
      toyType: await helpers.toyType.getOne({ name: "生日禮物" }),
      necessaryCoin: 99999,
      photoUrl: "toys/Birthday/happy-birthday-99999.png"
    },
    user: tmpAdminUser
  })
  await helpers.toy.create({
    input: {
      name: "生日快樂",
      enName: "bithday",
      toyType: await helpers.toyType.getOne({ name: "生日禮物" }),
      necessaryCoin: 999999,
      photoUrl: "toys/Birthday/happy-birthday-999999.png"
    },
    user: tmpAdminUser
  })
}
