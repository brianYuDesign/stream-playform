import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
})

describe("helpers-reward", async () => {
  it("create", async () => {
    const rewardCreateInput = {
      type: "VOUCHER",
      reward: 2,
      requiredPrice: 2000,
      description: "滿二千送兩張兌換券"
    }

    const newReward = await helpers.reward.create({
      input: rewardCreateInput,
      user
    })

    expect(newReward).to.have.property("id")
  })

  // it("update", async () => {
  //   const rewardUpdateInput = {
  //     requiredPrice: 1000
  //   }

  //   const reward = await helpers.reward.getOne({
  //     creator: "5e9682a4197609066897d540"
  //   })

  //   const updateReward = await helpers.reward.update({
  //     id: reward.id,
  //     input: rewardUpdateInput
  //   })

  //   expect(updateReward).to.have.property("id")
  //   expect(updateReward.requiredPrice).to.be.equal(1000)
  // })
})
