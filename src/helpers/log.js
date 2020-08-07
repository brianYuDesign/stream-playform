import dataProvider from "../data-provider"
import helpers from "."

export default {
  ...dataProvider.log,
  createLog: async ({ user, input }) => {
    await dataProvider.log.create({
      user,
      input
    })

    const logs = await dataProvider.log.getByFilter({
      creator: user.id,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    })

    if (logs.length === 1) {
      await helpers.loginHistory.createLoginHistory(user)
    }
  }
}
