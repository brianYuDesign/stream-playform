// import mongoose from "mongoose"
// import { expect } from "chai"
// import helpers from "../../src/helpers"
// import { before } from "mocha"

// let user
// describe("helpers-chatmessage", async () => {
//   before(async () => {
//     const url = `mongodb://127.0.0.1/KGCM-TEST`
//     await mongoose.connect(url, {
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useNewUrlParser: true
//     })

//     user = await helpers.user.create({
//       input: {
//         name: "5e4ba23986aa7d3e5b070b29"
//       }
//     })
//   })

//   it("create", async () => {
//     const chatmessageCreateInput = {
//       isRead: false,
//       type: "TEXT",
//       content: "hello world"
//     }

//     const newChatmessage = await helpers.chatmessage.create({
//       input: { ...chatmessageCreateInput, sender: user._id }
//     })

//     expect(newChatmessage).to.have.property("id")
//   })

//   it("update", async () => {
//     const chatmessageUpdateInput = {
//       isRead: true
//     }
//     const chatmessage = await helpers.chatmessage.getOne({
//       content: "hello world"
//     })
//     const updateChatmessage = await helpers.chatmessage.update({
//       id: chatmessage.id,
//       input: chatmessageUpdateInput
//     })

//     expect(updateChatmessage).to.have.property("id")
//     expect(updateChatmessage.isRead).to.be.equal(true)
//   })
// })
