import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, reward, coin

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  coin = await helpers.coin.create({
    input: {
      quantity: 99999,
      price: 199,
      lang: "TW"
    },
    user
  })
  reward = await helpers.reward.create({
    input: {
      description: "滿一千送100點"
    }
  })
})

describe("helpers-promotion", async () => {
  it("frontPromotions", async () => {
    const frontPromotions = await helpers.promotion
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

    expect(frontPromotions.length).to.equal(
      (await helpers.promotion.frontPromotions()).length
    )
  })

  it("getOrderPromotionReward", async () => {
    const promotions = await helpers.promotion
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

    const orderUpdateInput = {
      price: "1233",
      status: "success"
    }
    const updateOrder = await helpers.order.update({
      id: (await helpers.order.getAll())[0].id,
      input: orderUpdateInput
    })
    const order = (await helpers.order.getAll())[0]

    const rewards = (await helpers.reward.getByIds(rewardIds))
      .filter(item => order.price > item.requiredPrice)
      .sort((a, b) => b.requiredPrice - a.requiredPrice)

    const getOrderPromotionReward = await helpers.promotion.getOrderPromotionReward(
      { order }
    )

    expect(rewardIds).to.not.be.null
  })

  it("create", async () => {
    const promotionCreateInput = {
      title: "黑色星期五促銷",
      content: "黑色星期五大回饋",
      startTime: "2020-01-30T13:53:39.676+08:00",
      endTime: "2020-03-18T13:53:39.676+08:00",
      lang: "TW"
    }

    const newPromotion = await helpers.promotion.create({
      input: {
        ...promotionCreateInput,
        reward: reward._id,
        updater: user._id
      }
    })

    expect(newPromotion).to.have.property("id")
  })

  it("update", async () => {
    const promotionUpdateInput = {
      lang: "jp"
    }

    const promotion = await helpers.promotion.getOne({
      title: "黑色星期五促銷"
    })

    const updatePromotion = await helpers.promotion.update({
      id: promotion.id,
      input: promotionUpdateInput
    })

    expect(updatePromotion).to.have.property("id")
    expect(updatePromotion.lang).to.be.equal("jp")
  })
})
