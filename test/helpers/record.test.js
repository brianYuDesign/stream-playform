import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, consumeHistory

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  consumeHistory = await helpers.consumeHistory.create({
    input: {
      coin: 2,
      exchangeType: "COIN",
      type: "UNLOCK_CHAT"
    }
  })
})

describe("helpers-record", async () => {
  it("records", async () => {
    const results = await helpers.record.records({
      pageSize: 10,
      pageNumber: 1
    })
    expect(results.totalPage).to.equal(1)
  })

  it("convertArgToRecord", async () => {
    const recordCreateInput = {
      type: "CONSUME",
      coin: 22,
      description: "fhswjn 已消耗 2 寶石"
    }

    const newRecord = await helpers.record.create({
      input: {
        ...recordCreateInput,
        creator: user._id,
        consumeHistory: consumeHistory._id,
        reciver: user._id
      },
      user
    })

    expect(newRecord).to.have.property("id")
  })

  // it("update", async () => {
  //   const recordUpdateInput = {
  //     coin: 100
  //   }

  //   const record = await helpers.record.getOne({
  //     consumeHistory: "5e7dc4e31b30947cad275e33"
  //   })

  //   const updateRecord = await helpers.record.update({
  //     id: record.id,
  //     input: recordUpdateInput
  //   })

  //   expect(updateRecord).to.have.property("id")
  //   expect(updateRecord.coin).to.be.equal(100)
  // })
})
