import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"

let user

before(async () => {
  user = await helpers.user.getOne({ name: "brianFront" })
})

describe("helpers-roleFeature", async () => {
  it("getRoleAdminId", async () => {
    const getRoleAdminId = await helpers.roleFeature.getOne({
      name: "ADMIN"
    })
    expect(getRoleAdminId.id).to.not.be.null
  })

  it("getRoleManagerId", async () => {
    const getRoleManagerId = await helpers.roleFeature.getOne({
      name: "MANAGER"
    })

    expect(getRoleManagerId.id).to.not.be.null
  })

  it("getRoleDealerId", async () => {
    const getRoleDealerId = await helpers.roleFeature.getOne({
      name: "DEALER"
    })

    expect(getRoleDealerId.id).to.not.be.null
  })

  it("getRoleClientId", async () => {
    const getRoleClientId = await helpers.roleFeature.getOne({
      name: "CLIENT"
    })

    expect(getRoleClientId.id).to.not.be.null
  })

  it("getRoleArtistId", async () => {
    const getRoleArtistId = await helpers.roleFeature.getOne({
      name: "ARTIST"
    })

    expect(getRoleArtistId.id).to.not.be.null
  })
})
