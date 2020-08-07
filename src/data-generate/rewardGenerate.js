import { REWARD_TYPE_COIN, REWARD_TYPE_VOUCHER } from "../constants"
import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.reward.create({
    input: {
      type: REWARD_TYPE_COIN,
      reward: 100,
      requiredPrice: 1000,
      description: "滿一千送100點"
    },
    user: tmpAdminUser
  })
  await helpers.reward.create({
    input: {
      type: REWARD_TYPE_COIN,
      reward: 200,
      requiredPrice: 2000,
      description: "滿二千送200點"
    },
    user: tmpAdminUser
  })
  await helpers.reward.create({
    input: {
      type: REWARD_TYPE_VOUCHER,
      reward: 1,
      requiredPrice: 1000,
      description: "滿一千送一張兌換券"
    },
    user: tmpAdminUser
  })
  await helpers.reward.create({
    input: {
      type: REWARD_TYPE_VOUCHER,
      reward: 2,
      requiredPrice: 2000,
      description: "滿二千送兩張兌換券"
    },
    user: tmpAdminUser
  })
}
