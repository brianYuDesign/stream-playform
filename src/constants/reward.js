import _ from "lodash"

export const REWARD_TYPE_COIN = "COIN"
export const REWARD_TYPE_VOUCHER = "VOUCHER"

export const REWARD_TYPE = {
  REWARD_TYPE_COIN,
  REWARD_TYPE_VOUCHER
}

export const REWARD_TYPE_LIST = _.values(REWARD_TYPE)
