import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.toyType.create({
    input: { name: "聖誕主播", enName: "Chrismas Fucker" },
    user: tmpAdminUser
  })
  await helpers.toyType.create({
    input: { name: "性感主播", enName: "Sexy Fucker" },
    user: tmpAdminUser
  })
  await helpers.toyType.create({
    input: { name: "情趣玩具", enName: "Sexy Toy" },
    user: tmpAdminUser
  })
  await helpers.toyType.create({
    input: { name: "豪華寶貝", enName: "Luxury Baby" },
    user: tmpAdminUser
  })
  await helpers.toyType.create({
    input: { name: "生日禮物", enName: "Birthday" },
    user: tmpAdminUser
  })
}
