import env from "dotenv"
import dataProvider from "../data-provider"
import { ezPayService } from "../services"

env.config()

const { EZPAY_INVOICE_KEY, EZPAY_INVOICE_IV } = process.env

export default {
  ...dataProvider.invoice,
  async createInvoice({ order }) {
    let invoice = await dataProvider.invoice.getOne({ order: order.id })
    if (!invoice) {
      invoice = await dataProvider.invoice.create({
        input: {
          order: order.id,
          creator: order.creator
        }
      })
    }

    const user = await dataProvider.user.getById(order.creator)

    const inputString = await ezPayService.createInvoiceInputString({
      order,
      user
    })

    const aesEncrypt = ezPayService.createAESEncrypt(
      inputString,
      EZPAY_INVOICE_KEY,
      EZPAY_INVOICE_IV
    )

    const apiResult = await ezPayService.createInvoice(aesEncrypt)

    console.log(apiResult)

    const result = {
      Status: apiResult.Status,
      Message: apiResult.Message,
      ...(apiResult.Result.length > 0 && JSON.parse(apiResult.Result))
    }

    invoice = await this.updateInvoice({ invoice, result })
    return invoice
  },
  updateInvoice: async ({ invoice, result }) =>
    dataProvider.invoice.update({
      id: invoice.id,
      input: {
        status: result.Status,
        statusMessage: result.Message,
        checkCode: result.CheckCode,
        invoiceNumber: result.InvoiceNumber,
        invoiceTransNo: result.InvoiceTransNo,
        totalAmt: result.TotalAmt ? Number(result.TotalAmt) : null,
        randomNum: result.RandomNum,
        createTime: result.CreateTime ? new Date() : null,
        barCode: result.BarCode,
        qrCodeL: result.QRcodeL,
        qrCodeR: result.QRcodeR
      }
    })
}
