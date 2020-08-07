import { expect } from "chai"
import helpers from "../../src/helpers"

describe("helpers-coin", async () => {
  it("frontCoins", async () => {
    const lang = "JP"
    const frontCoins = await helpers.coin.frontCoins({ lang })

    expect(frontCoins.length).to.equal(
      (await helpers.coin.frontCoins({ lang })).length
    )
  })
})
