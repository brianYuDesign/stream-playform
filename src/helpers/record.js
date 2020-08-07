import {
  RECORD_TYPE_BUYING,
  RECORD_TYPE_REWARD,
  RECORD_TYPE_CONSUME,
  RECORD_NOTIFICATION
} from "../constants"
import { pubsub, stringCompare } from "../utils"
import dataProvider from "../data-provider"

const getDescription = ({ type, coin, user }) => {
  const recordType = [
    RECORD_TYPE_REWARD,
    RECORD_TYPE_BUYING,
    RECORD_TYPE_CONSUME
  ]

  const typeDescription = [
    `${user.uid} 已得到 ${Math.abs(coin)} 獎勵`,
    `${user.uid} 已購買 ${Math.abs(coin)} 寶石`,
    `${user.uid} 已消耗 ${Math.abs(coin)} 寶石`
  ]

  return typeDescription[recordType.indexOf(type)]
}

export default {
  ...dataProvider.record,
  userRecords: async ({ type, user }) =>
    dataProvider.record
      .getByFilter({
        ...(type && { type }),
        creator: user.id
      })
      .sort({
        createdAt: "desc"
      }),
  records: async ({ pageSize = 10, pageNumber, filter }) => {
    const results = await dataProvider.record.paginate(
      {
        ...(filter &&
          filter.type && {
            type: filter.type
          }),
        ...(filter &&
          filter.creator && {
            creator: filter.creator
          })
      },
      { pageSize, pageNumber, sort: { createdAt: "-1" } }
    )

    return {
      totalPage: results.totalPages,
      records: results.docs
    }
  },
  async convertArgToRecord(
    args = {
      consumeHistory: null,
      order: null,
      reward: null,
      loginHistory: null
    },
    type = null,
    coin = 0,
    user = null,
    reciverId = null,
    updateUserCoin = (coinQty, user) =>
      dataProvider.user.update(
        {
          id: user.id,
          input: { $inc: { coin: coinQty } }
        },
        user
      ),
    publish = record => {
      pubsub.publish(RECORD_NOTIFICATION, {
        recordNotification: record
      })
    }
  ) {
    const record = await dataProvider.record.create({
      input: {
        ...args,
        type,
        coin,
        reciver: reciverId,
        description: getDescription({ type, coin, user })
      },
      user
    })
    await updateUserCoin(coin, user)
    await publish(record)
    return record
  },
  recordNotificationSubscibeFilter: async ({ recordNotification, user }) =>
    stringCompare(recordNotification.creator, user.id)
}
