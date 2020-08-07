import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { CHATMESSAGE_TYPE_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const chatmessageSchema = new Schema(
  {
    type: {
      type: String,
      enum: CHATMESSAGE_TYPE_LIST
    },
    content: {
      type: String
    },
    fileName: {
      type: String
    },
    isRead: {
      type: Boolean,
      default: false
    },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom"
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

chatmessageSchema.methods.joiValidate = obj => {
  const schema = {
    type: Joi.string().required(),
    content: Joi.string().required(),
    fileName: Joi.string(),
    isRead: Joi.boolean(),
    chatroom: Joi.objectId().required(),
    agent: Joi.objectId(),
    sender: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

chatmessageSchema.plugin(mongooseLeanId)

chatmessageSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Chatmessage", chatmessageSchema)
