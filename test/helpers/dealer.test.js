import { expect } from "chai"
import helpers from "../../src/helpers"

let user = helpers.user.getOne({ name: "brianBack" })

describe("helpers-dealer", async () => {
  it("createDealer", async () => {
    const input = {
      isEnabled: true,
      ban: "53117492",
      name: "經銷商B",
      owner: "B",
      email: "dealerb@dealer.com",
      address: "DealerB地址",
      phoneNumber: "0912345666",
      profitPercentSetting: 20,
      contractUrl: "https://reurl.cc/O1Elv9"
    }

    const newDealer = await helpers.dealer.createDealer({ input, user })

    expect(newDealer).to.have.property("id")
  })

  it("updateDealer", async () => {
    const dealerUpdateInput = {
      email: "dealer@dealer.com"
    }

    const dealer = (await helpers.dealer.getAll())[0]
    const updateDealer = await helpers.dealer.updateDealer({
      id: dealer.id,
      input: dealerUpdateInput,
      user
    })

    expect(updateDealer).to.have.property("id")
    expect(updateDealer).to.have.property("id")
    expect(updateDealer.email).to.be.equal("dealer@dealer.com")
  })
})
