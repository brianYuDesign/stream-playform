import _ from "lodash"

// 日誌類型
// 獎勵
export const RECORD_TYPE_REWARD = "REWARD"
// 購買
export const RECORD_TYPE_BUYING = "BUYING"
// 消耗
export const RECORD_TYPE_CONSUME = "CONSUME"

export const RECORD_TYPE = {
  RECORD_TYPE_REWARD,
  RECORD_TYPE_BUYING,
  RECORD_TYPE_CONSUME
}

export const RECORD_TYPE_LIST = _.values(RECORD_TYPE)
