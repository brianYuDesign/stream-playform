import { LANG_TW } from "../constants"
import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.banner.create({
    input: {
      name: "雙十一促銷活動",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      destinationUrl: "http://localhost:3000",
      photoUrl: "banners/001/001.jpg",
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.banner.create({
    input: {
      name: "感恩節促銷活動",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      destinationUrl: "http://localhost:3000/tks",
      photoUrl: "banners/001/002.jpg",
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
}
