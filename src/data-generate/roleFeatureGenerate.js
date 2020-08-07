import { ADMIN, MANAGER, DEALER, CLIENT, ARTIST } from "../constants"
import helpers from "../helpers"

export default async () => {
  await helpers.roleFeature.create({
    input: { name: ADMIN, displayName: "超級管理者" }
  })
  await helpers.roleFeature.create({
    input: { name: MANAGER, displayName: "管理者" }
  })
  await helpers.roleFeature.create({
    input: { name: DEALER, displayName: "經銷商" }
  })
  await helpers.roleFeature.create({
    input: { name: CLIENT, displayName: "用戶" }
  })
  await helpers.roleFeature.create({
    input: { name: ARTIST, displayName: "主播" }
  })
}
