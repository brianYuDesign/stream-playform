// import mongoose from "mongoose"
// import { expect } from "chai"
// import helpers from "../../src/helpers"
// import { before } from "mocha"

// let user

// describe("helpers-chatroom", async () => {
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
//         name: "5e4ba23986aa7d3e5b070b29",
//         replyCoin: 2
//       }
//     })
//   })

//   it("create", async () => {
//     const chatroomCreateInput = {
//       participants: user
//     }

//     const newChatroom = await helpers.chatroom.create({
//       input: chatroomCreateInput
//     })

//     expect(newChatroom).to.have.property("id")
//   })
// })
