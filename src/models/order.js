import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import mongoosePaginate from "mongoose-paginate-v2"
import { ORDER_STATUS_LIST, ORDER_STATUS_CREATED } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String
    },
    price: {
      type: Number
    },
    coinQuantity: {
      type: Number
    },
    status: {
      type: String,
      enum: ORDER_STATUS_LIST,
      default: ORDER_STATUS_CREATED
    },
    statusMessage: {
      type: String
    },
    tradeNumber: {
      type: String
    },
    payTime: {
      type: Date
    },
    redirectUrl: {
      type: String
    },
    clientBackUrl: {
      type: String
    },
    aes: {
      type: String
    },
    sha: {
      type: String
    },
    coin: {
      type: Schema.Types.ObjectId,
      ref: "Coin"
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

orderSchema.methods.joiValidate = obj => {
  const schema = {
    orderNumber: Joi.string(),
    price: Joi.number().required(),
    coinQuantity: Joi.number().required(),
    status: Joi.string().required(),
    coin: Joi.objectId(),
    tradeNumber: Joi.string(),
    statusMessage: Joi.string(),
    payTime: Joi.date(),
    redirectUrl: Joi.string(),
    clientBackUrl: Joi.string(),
    aes: Joi.string(),
    sha: Joi.string(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

orderSchema.plugin(mongooseLeanId)
orderSchema.plugin(mongoosePaginate)

orderSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Order", orderSchema)
