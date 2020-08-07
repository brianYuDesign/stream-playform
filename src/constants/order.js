import _ from "lodash"

// 訂單狀態
export const ORDER_STATUS_CREATED = "CREATED"
export const ORDER_STATUS_SUCCESS = "SUCCESS"
export const ORDER_STATUS_FAIL = "FAIL"

export const ORDER_STATUS = {
  ORDER_STATUS_CREATED,
  ORDER_STATUS_SUCCESS,
  ORDER_STATUS_FAIL
}

export const ORDER_STATUS_LIST = _.values(ORDER_STATUS)
