import dataProvider from "../data-provider"

export default {
  ...dataProvider.promotion,
  frontPromotions: async () =>
    dataProvider.promotion
      .getByFilter({
        startTime: {
          $lt: new Date()
        },
        endTime: {
          $gte: new Date()
        }
      })
      .sort({
        createdAt: "desc"
      }),
  getOrderPromotionReward: async order => {
    const promotions = await dataProvider.promotion
      .getByFilter({
        startTime: {
          $lt: new Date()
        },
        endTime: {
          $gte: new Date()
        }
      })
      .sort({
        createdAt: "desc"
      })

    if (promotions.length === 0) return null

    const rewardIds = promotions
      .filter(item => item.reward !== null || !item.reward)
      .map(item => item.reward)

    if (rewardIds.length === 0) return null

    const rewards = (await dataProvider.reward.getByIds(rewardIds))
      .filter(item => order.price > item.requiredPrice)
      .sort((a, b) => b.requiredPrice - a.requiredPrice)

    if (rewards.length === 0) {
      return null
    }

    return {
      reward: rewards[0],
      promotion: promotions.find(
        item => String(item.reward) === String(rewards[0]._id)
      )
    }
  }
}
