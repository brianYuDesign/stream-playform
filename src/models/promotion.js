import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { LANG_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const promotionSchema = new Schema(
  {
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    title: {
      type: String
    },
    content: {
      type: String
    },
    lang: {
      type: String,
      enum: LANG_LIST
    },
    reward: {
      type: Schema.Types.ObjectId,
      ref: "Reward"
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

promotionSchema.methods.joiValidate = obj => {
  const schema = {
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    lang: Joi.string().required(),
    reward: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

promotionSchema.plugin(mongooseLeanId)

promotionSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Promotion", promotionSchema)
