import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, coin

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  coin = await helpers.coin.create({
    input: {
      quantity: 99999,
      price: 199,
      lang: "TW"
    },
    user
  })
})

describe("helpers-order", async () => {
  it("orders", async () => {
    const result = await helpers.order.orders({
      pageSize: 10
    })
    expect(result.totalPage).to.equal(1)
  })

  it("getOrderNumber", async () => {
    const result = await helpers.order
      .getByFilter({
        orderNumber: { $ne: null },
        createdAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      })
      .sort({
        createdAt: -1
      })

    expect(result.length).to.equal(1)
  })

  it("createOrder", async () => {
    const orderCreateInput = {
      status: "SUCCESS",
      orderNumber: "K20200325000010",
      price: 99,
      coinQuantity: 49999,
      payTime: "2020-03-25T16:01:22.962+08:00",
      statusMessage: "授權成功",
      tradeNumber: "20032516011595867"
    }
    const newOrder = await helpers.order.createOrder({
      input: { ...orderCreateInput, coin: coin._id },
      user
    })
    expect(newOrder).to.have.property("id")
  })

  it("update", async () => {
    const orderUpdateInput = {
      price: 123
    }

    const order = (await helpers.order.getAll())[0]
    const updateOrder = await helpers.order.update({
      id: order.id,
      input: orderUpdateInput
    })

    expect(updateOrder).to.have.property("id")
    expect(updateOrder.price).to.be.equal(123)
  })
})
