import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { LANG_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const coinSchema = new Schema(
  {
    quantity: {
      type: Number
    },
    price: {
      type: Number
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      enum: LANG_LIST
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

coinSchema.methods.joiValidate = obj => {
  const schema = {
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    isEnabled: Joi.boolean(),
    lang: Joi.string().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

coinSchema.plugin(mongooseLeanId)

coinSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Coin", coinSchema)
