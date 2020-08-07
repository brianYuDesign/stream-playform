import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import mongoosePaginate from "mongoose-paginate-v2"
import {
  CONSUME_HISTORY_TYPE_LIST,
  CONSUME_HISTORY_EXCHANGE_TYPE_LIST
} from "../constants"

Joi.objectId = JoiObjectId(Joi)

const consumeHistorySchema = new Schema(
  {
    type: {
      type: String,
      enum: CONSUME_HISTORY_TYPE_LIST
    },
    exchangeType: {
      type: String,
      enum: CONSUME_HISTORY_EXCHANGE_TYPE_LIST
    },
    coin: {
      type: Number
    },
    voucher: {
      type: Schema.Types.ObjectId,
      ref: "Voucher"
    },
    subscribe: {
      type: Schema.Types.ObjectId,
      ref: "Subscribe"
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story"
    },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom"
    },
    toy: {
      type: Schema.Types.ObjectId,
      ref: "Toy"
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    dealer: {
      type: Schema.Types.ObjectId,
      ref: "Dealer"
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updater: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    userTimeStamp: {
      type: String
    }
  },
  { timestamps: true }
)

consumeHistorySchema.methods.joiValidate = obj => {
  const schema = {
    type: Joi.string().required(),
    exchangeType: Joi.string().required(),
    coin: Joi.number(),
    voucher: Joi.objectId(),
    subscribe: Joi.objectId(),
    story: Joi.objectId(),
    chat: Joi.objectId(),
    toy: Joi.objectId(),
    artist: Joi.objectId(),
    dealer: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

consumeHistorySchema.plugin(mongooseLeanId)
consumeHistorySchema.plugin(mongoosePaginate)

consumeHistorySchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("ConsumeHistory", consumeHistorySchema)
