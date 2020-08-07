import _ from "lodash"

export const CONSUME_HISTORY_TYPE_SEND_TOY = "SEND_TOY"
export const CONSUME_HISTORY_TYPE_SUBSCRIBE = "SUBSCRIBE"
export const CONSUME_HISTORY_TYPE_UNLOCK_CHAT = "UNLOCK_CHAT"
export const CONSUME_HISTORY_TYPE_UNLOCK_STORY = "UNLOCK_STORY"

export const CONSUME_HISTORY_TYPE = {
  CONSUME_HISTORY_TYPE_SEND_TOY,
  CONSUME_HISTORY_TYPE_SUBSCRIBE,
  CONSUME_HISTORY_TYPE_UNLOCK_CHAT,
  CONSUME_HISTORY_TYPE_UNLOCK_STORY
}

export const CONSUME_HISTORY_TYPE_MAP = {
  SEND_TOY: "送禮",
  SUBSCRIBE: "訂閱",
  UNLOCK_CHAT: "解鎖聊天",
  UNLOCK_STORY: "解鎖貼文"
}

export const CONSUME_HISTORY_TYPE_LIST = _.values(CONSUME_HISTORY_TYPE)

export const CONSUME_HISTORY_EXCHANGE_TYPE_VOUCHER = "VOUCHER"
export const CONSUME_HISTORY_EXCHANGE_TYPE_COIN = "COIN"

export const CONSUME_HISTORY_EXCHANGE_TYPE = {
  CONSUME_HISTORY_EXCHANGE_TYPE_VOUCHER,
  CONSUME_HISTORY_EXCHANGE_TYPE_COIN
}

export const CONSUME_HISTORY_EXCHANGE_TYPE_LIST = _.values(
  CONSUME_HISTORY_EXCHANGE_TYPE
)
