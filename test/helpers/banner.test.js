import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { before } from "mocha"
import { expect } from "chai"
import helpers from "../../src/helpers"
import dataGenerate from "../../src/data-generate"

let mongoServer, user

before(async () => {
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(mongoUri, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  await dataGenerate.generate()

  user = await helpers.user.getOne({ name: "brianBack" })
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe("helpers-banner", async () => {
  it("frontBanners", async () => {
    const frontBanners = await helpers.banner.getByFilter({
      startTime: {
        $lt: new Date()
      },
      endTime: {
        $gte: new Date()
      }
    })

    expect(frontBanners.length).to.equal(
      (await helpers.banner.frontBanners()).length
    )
  })

  it("createBanner", async () => {
    const input = {
      name: "cover girl 1",
      startTime: new Date(new Date().setDate(-1)),
      endTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      destinationUrl: "https://24h.pchome.com.tw/prod/DMAH3V-A90065A0P",
      photoUrl: "banners/5e4b7be3c88999092004b3d9-1582014491518.jpg",
      lang: "TW"
    }

    const newBanner = await helpers.banner.createBanner({ input, user })

    expect(newBanner).to.have.property("id")
  })

  it("updateBanner", async () => {
    const bannerUpdateInput = {
      name: "cover girl 2"
    }
    const banner = await helpers.banner.getOne({ name: "cover girl 1" })
    const updateBanner = await helpers.banner.updateBanner({
      id: banner.id,
      input: bannerUpdateInput,
      user
    })

    expect(await helpers.banner.frontBanners()).to.have.lengthOf(3)
    expect(updateBanner).to.have.property("id")
    expect(updateBanner).to.have.property("lang")
    expect(updateBanner).to.not.have.own.property("lang")
    expect(updateBanner).to.not.have.all.keys("lang")
    expect(updateBanner).to.not.have.any.keys("price", "quantity")
    expect(updateBanner.lang).to.be.a("string")
    expect(updateBanner.name).to.be.equal("cover girl 2")
  })
})
