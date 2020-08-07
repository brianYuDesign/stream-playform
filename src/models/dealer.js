import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const dealerSchema = new Schema(
  {
    ban: {
      type: String
    },
    owner: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    contractUrl: {
      type: String
    },
    profitPercentSetting: {
      type: Number
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    systemUser: {
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

dealerSchema.methods.joiValidate = obj => {
  const schema = {
    ban: Joi.string().required(),
    owner: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    contractUrl: Joi.string(),
    profitPercentSetting: Joi.number(),
    isEnabled: Joi.boolean(),
    systemUser: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

dealerSchema.plugin(mongooseLeanId)

dealerSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Dealer", dealerSchema)
