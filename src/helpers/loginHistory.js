import dataProvider from "../data-provider"
import { addDays } from "../utils"
import { RECORD_TYPE_REWARD } from "../constants"
import helpers from "."

const BONUS_LEVEL = [10, 10, 20, 30, 40, 50, 100]
const MAXIMUM_DAYS = 7

export default {
  ...dataProvider.loginHistory,
  async createLoginHistory(user) {
    const newLoginHistory = await dataProvider.loginHistory.create({
      user,
      input: {}
    })

    const bonus = await this.getTodayBonus(user.id)
    await helpers.record.convertArgToRecord(
      {
        loginHistory: newLoginHistory.id
      },
      RECORD_TYPE_REWARD,
      bonus,
      user,
      user.id
    )

    return newLoginHistory
  },
  getTodayBonus: async userId => {
    const userLoginHistories = await dataProvider.loginHistory
      .getByFilter({ creator: userId })
      .sort({
        createdAt: -1
      })

    const setDate = []
    userLoginHistories.forEach(item => {
      const day = new Date(item.createdAt).getDate()
      if (!setDate.includes(day)) {
        setDate.push(day)
      }
    })

    let consecutiveDays = 0
    if (userLoginHistories > 1) {
      for (let i = 1; i < setDate.length; i += 1) {
        if (
          setDate[i].includes(addDays(new Date(), -i)) &&
          consecutiveDays <= MAXIMUM_DAYS
        ) {
          consecutiveDays += 1
        } else {
          break
        }
      }
    }

    return BONUS_LEVEL[consecutiveDays]
  }
}
