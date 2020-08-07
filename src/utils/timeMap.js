import { ONEDAY, ONEWEEK, ONEMONTH } from "../constants"

const timeMap = new Map()
timeMap.set(ONEDAY, new Date().setDate(new Date().getDate() - 1))
timeMap.set(ONEWEEK, new Date().setDate(new Date().getDate() - 7))
timeMap.set(ONEMONTH, new Date().setMonth(new Date().getMonth() - 1))

export default timeMap
