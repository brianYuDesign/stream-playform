import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const chatroomSchema = new Schema(
  {
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Chatmessage"
    },
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        replyCoin: {
          type: Number
        }
      }
    ]
  },
  { timestamps: true }
)

chatroomSchema.methods.joiValidate = obj => {
  const schema = {
    lastMessage: Joi.objectId(),
    participants: Joi.array()
  }
  return Joi.joiValidate(obj, schema)
}

chatroomSchema.plugin(mongooseLeanId)

chatroomSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Chatroom", chatroomSchema)
