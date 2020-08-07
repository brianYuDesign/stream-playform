import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, order, newInvoice
const { EZPAY_INVOICE_KEY, EZPAY_INVOICE_IV } = process.env

before(async () => {
  order = await helpers.order.create({
    input: {
      orderNumber: "5e7b0437155a0108522ba4e4"
    }
  })
  user = await helpers.user.getOne({ name: "brianFront" })
})

describe("helpers-invoice", async () => {
  it("createInvoice", async () => {
    const invoiceCreateInput = {
      Status: "SUCCESS"
    }
    const invoiceGetOne = await helpers.invoice.getOne({
      order: order.orderNumber
    })
    if (!invoiceGetOne) {
      newInvoice = await helpers.invoice.create({
        input: {
          ...invoiceCreateInput,
          creator: user.id,
          order: order.orderNumber
        }
      })
    }

    expect(newInvoice).to.have.property("id")
  })
  // it("updateInvoice", async () => {
  //   const invoice = await helpers.invoice.getOne({
  //     order: "5e7b0437155a0108522ba4e4"
  //   })
  //   console.log("invoice", invoice)

  //   const updateInvoice = await helpers.invoice.updateInvoice({
  //     invoice: invoice.id
  //   })
  //   console.log(helpers.invoice.updateInvoice({ invoice }))

  // expect(await helpers.invoice.frontinvoices()).to.have.lengthOf(3)
  // expect(updateInvoice).to.have.property("id")
  // expect(updateInvoice).to.have.property("lang")
  // expect(updateInvoice).to.not.have.own.property("lang")
  // expect(updateInvoice).to.not.have.all.keys("lang")
  // expect(updateInvoice).to.not.have.any.keys("price", "quantity")
  // expect(updateInvoice.lang).to.be.a("string")
  // expect(updateInvoice.name).to.be.equal("cover girl 2")
  // })
})
