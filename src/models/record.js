import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import mongoosePaginate from "mongoose-paginate-v2"
import { RECORD_TYPE_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const recordSchema = new Schema(
  {
    coin: {
      type: Number
    },
    type: {
      type: String,
      enum: RECORD_TYPE_LIST
    },
    description: {
      type: String
    },
    loginHistory: {
      type: Schema.Types.ObjectId,
      ref: "LoginHistory"
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    },
    consumeHistory: {
      type: Schema.Types.ObjectId,
      ref: "ConsumeHistory"
    },
    reward: {
      type: Schema.Types.ObjectId,
      ref: "Reward"
    },
    reciver: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updater: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

recordSchema.methods.joiValidate = obj => {
  const schema = {
    coin: Joi.number().required(),
    type: Joi.string().required(),
    description: Joi.string(),
    loginHistory: Joi.objectId(),
    order: Joi.objectId(),
    consumeHistory: Joi.objectId(),
    reward: Joi.objectId(),
    reciver: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

recordSchema.plugin(mongooseLeanId)
recordSchema.plugin(mongoosePaginate)

recordSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Record", recordSchema)
