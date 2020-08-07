import { LANG_TW } from "../constants"
import { getRandomObject } from "../utils"
import helpers from "../helpers"

export default async (tmpAdminUser, rewards) => {
  await helpers.promotion.create({
    input: {
      title: "感恩節促銷",
      content: "感恩節大回饋",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      lang: LANG_TW,
      reward: getRandomObject(rewards).id
    },
    user: tmpAdminUser
  })
  await helpers.promotion.create({
    input: {
      title: "黑色星期五促銷",
      content: "黑色星期五大回饋",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      lang: LANG_TW,
      reward: getRandomObject(rewards).id
    },
    user: tmpAdminUser
  })
  await helpers.promotion.create({
    input: {
      title: "聖誕夜促銷",
      content: "聖誕夜大回饋",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      lang: LANG_TW,
      reward: getRandomObject(rewards).id
    },
    user: tmpAdminUser
  })
}
