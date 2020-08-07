import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { INVOICE_STATUS_LIST, INVOICE_STATUS_CREATED } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const invoiceSchema = new Schema(
  {
    status: {
      type: String,
      enum: INVOICE_STATUS_LIST,
      default: INVOICE_STATUS_CREATED
    },
    statusMessage: {
      type: String
    },
    checkCode: {
      type: String
    },
    invoiceNumber: {
      type: String
    },
    invoiceTransNo: {
      type: String
    },
    totalAmt: {
      type: Number
    },
    randomNum: {
      type: String
    },
    createTime: {
      type: Date
    },
    barCode: {
      type: String
    },
    qrCodeL: {
      type: String
    },
    qrCodeR: {
      type: String
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order"
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

invoiceSchema.methods.joiValidate = obj => {
  const schema = {
    creator: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

invoiceSchema.plugin(mongooseLeanId)

invoiceSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Invoice", invoiceSchema)
