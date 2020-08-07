import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const subscribeSchema = new Schema(
  {
    year: {
      type: Number
    },
    month: {
      type: Number
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

subscribeSchema.methods.joiValidate = obj => {
  const schema = {
    year: Joi.number().required(),
    month: Joi.number().required(),
    artist: Joi.objectId().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

subscribeSchema.plugin(mongooseLeanId)

subscribeSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Subscribe", subscribeSchema)
