import crypto from "crypto"
import env from "dotenv"
import fetch from "node-fetch"
import { USER_INVOICE_PERSONAL, USER_INVOICE_LOVE } from "../constants"

env.config()

const {
  EZPAY_MERCHANTID,
  EZPAY_VERSION,
  EZPAY_INVOICE_VERSION,
  EZPAY_INVOICE_API_ENDPOINT,
  EZPAY_INVOICE_MERCHANTID,
  EZPAY_RETURNURL
} = process.env

const genDataChain = arg => {
  const results = []
  Object.keys(arg).forEach(item => {
    results.push(`${item}=${arg[item]}`)
  })
  return results.join("&")
}

const getResultByChain = chain => {
  const result = {}
  chain.split("&").forEach(item => {
    const chainItem = item.split("=")
    const key = chainItem[0]
    const value = chainItem[1]
    result[key] = value
  })

  return result
}

const createOrderInputString = async ({ order, user }) => {
  const inputData = {}
  inputData.MerchantID = EZPAY_MERCHANTID
  inputData.RespondType = "String"
  inputData.TimeStamp = Date.parse(order.createdAt)
  inputData.Version = EZPAY_VERSION
  inputData.MerchantOrderNo = order.orderNumber
  inputData.Amt = order.price
  inputData.ItemDesc = `購買 ${order.coinQuantity} 寶石`
  inputData.email = user.email
  inputData.LoginType = 0
  inputData.CREDIT = 1
  inputData.ReturnURL = EZPAY_RETURNURL
  inputData.ClientBackURL = order.clientBackUrl

  return genDataChain(inputData)
}

const createInvoiceInputString = async ({ order, user }) => {
  const inputData = {}
  inputData.RespondType = "JSON"
  inputData.Version = EZPAY_INVOICE_VERSION
  inputData.TimeStamp = Date.parse(new Date()) / 1000
  inputData.TransNum = order.tradeNumber
  inputData.MerchantOrderNo = `${order.orderNumber}`
  inputData.Status = "1"
  inputData.Category = "B2C"
  inputData.BuyerName = user.invoiceBuyer
    ? user.invoiceBuyer
    : user.name || "匿名"
  inputData.BuyerEmail =
    user.invoiceType === USER_INVOICE_PERSONAL ? user.email : ""
  inputData.CarrierType = user.invoiceType === USER_INVOICE_PERSONAL ? "2" : ""
  inputData.CarrierNum =
    user.invoiceType === USER_INVOICE_PERSONAL ? user.email : ""
  inputData.LoveCode = user.invoiceType === USER_INVOICE_LOVE ? 7885 : ""
  inputData.PrintFlag = user.invoiceType === USER_INVOICE_LOVE ? "N" : "Y"
  inputData.TaxType = "1"
  inputData.TaxRate = 5
  // 未稅
  inputData.Amt = parseInt(order.price / 1.05, 0)
  // 發票稅額
  inputData.TaxAmt = order.price - parseInt(order.price / 1.05, 0)
  // 發票金額
  inputData.TotalAmt = order.price
  inputData.ItemName = `數位貨幣 ${order.coinQuantity}`
  inputData.ItemCount = 1
  inputData.ItemUnit = "批"
  inputData.ItemPrice = order.price
  inputData.ItemAmt = order.price
  return genDataChain(inputData)
}

const createInvoice = async aesEncrypt => {
  const res = await fetch(EZPAY_INVOICE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;"
    },
    body: `MerchantID_=${EZPAY_INVOICE_MERCHANTID}&PostData_=${aesEncrypt}`
  })
  return res.json()
}

const createAESEncrypt = (inputString, KEY, IV) => {
  const encrypt = crypto.createCipheriv("aes256", KEY, IV)
  const enc = encrypt.update(inputString, "utf8", "hex")
  return enc + encrypt.final("hex")
}

const createShaEncrypt = (aesEncrypt, KEY, IV) => {
  const sha = crypto.createHash("sha256")
  const plainText = `HashKey=${KEY}&${aesEncrypt}&HashIV=${IV}`

  return sha.update(plainText).digest("hex").toUpperCase()
}

const getDecryptTradeInfo = (TradeInfo, KEY, IV) => {
  const decrypt = crypto.createDecipheriv("aes256", KEY, IV)
  decrypt.setAutoPadding(false)
  const text = decrypt.update(TradeInfo, "hex", "utf8")
  const plainText = text + decrypt.final("utf8")
  return decodeURI(plainText)
}

export default {
  genDataChain,
  getResultByChain,
  createInvoice,
  createInvoiceInputString,
  createOrderInputString,
  createAESEncrypt,
  createShaEncrypt,
  getDecryptTradeInfo
}
