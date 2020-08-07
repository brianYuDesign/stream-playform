import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import {
  VOUCHER_TYPE_LIST,
  VOUCHER_STATUS_LIST,
  VOUCHER_SOURCE_LIST
} from "../constants"

Joi.objectId = JoiObjectId(Joi)

const voucherSchema = new Schema(
  {
    status: {
      type: String,
      enum: VOUCHER_STATUS_LIST
    },
    source: {
      type: String,
      enum: VOUCHER_SOURCE_LIST
    },
    type: {
      type: String,
      enum: VOUCHER_TYPE_LIST
    },
    year: { type: Number },
    month: { type: Number },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    artist: {
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

voucherSchema.methods.joiValidate = obj => {
  const schema = {
    source: Joi.string().required(),
    status: Joi.string().required(),
    type: Joi.string().required(),
    year: Joi.number(),
    month: Joi.number(),
    owner: Joi.objectId(),
    artist: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

voucherSchema.plugin(mongooseLeanId)

voucherSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Voucher", voucherSchema)
