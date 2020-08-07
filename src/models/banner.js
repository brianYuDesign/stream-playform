import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { LANG_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const bannerSchema = new Schema(
  {
    name: {
      type: String
    },
    photoUrl: {
      type: String
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    destinationUrl: {
      type: String
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updater: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    lang: {
      type: String,
      enum: LANG_LIST
    }
  },
  { timestamps: true }
)

bannerSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    photoUrl: Joi.string(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    destinationUrl: Joi.string(),
    lang: Joi.string().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

bannerSchema.plugin(mongooseLeanId)

bannerSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Banner", bannerSchema)
