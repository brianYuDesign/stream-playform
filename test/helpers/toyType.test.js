import { expect } from "chai"
import helpers from "../../src/helpers"

describe("helpers-toyType", async () => {
  it("create", async () => {
    const isEnabled = isEnabled
      ? helpers.toyType.getByFilter({ isEnabled })
      : helpers.toyType.getAll()
    const newToyType = await helpers.toyType.toyTypes({
      input: isEnabled
    })

    expect(newToyType.length).to.equal(6)
  })
})
