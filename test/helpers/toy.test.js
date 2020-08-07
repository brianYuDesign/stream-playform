import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user, toyType

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
  toyType = await helpers.toyType.create({
    input: {
      isEnabled: true,
      // creator: user._id,
      name: "聖誕主播",
      enName: "Chrismas Fucker"
    }
  })
})

describe("helpers-toy", async () => {
  it("create", async () => {
    const toyCreateInput = {
      name: "生日快樂",
      enName: "bithday",
      necessaryCoin: 9999,
      photoUrl: "https://reurl.cc/arapX4"
    }

    const newToy = await helpers.toy.create({
      input: { ...toyCreateInput, creator: user._id, toyType: toyType._id },
      user
    })

    expect(newToy).to.have.property("id")
  })

  it("update", async () => {
    const toyUpdateInput = {
      necessaryCoin: 101
    }

    const toy = await helpers.toy.getOne({
      necessaryCoin: 9999
    })

    const updateToy = await helpers.toy.updateToy({
      id: toy.id,
      input: toyUpdateInput,
      user
    })

    expect(updateToy).to.have.property("id")
    expect(updateToy.necessaryCoin).to.be.equal(101)
  })
})
