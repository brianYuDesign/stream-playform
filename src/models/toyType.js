import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const toyTypeSchema = new Schema(
  {
    name: {
      type: String
    },
    enName: {
      type: String
    },
    isEnabled: {
      type: Boolean,
      default: true
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

toyTypeSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    enName: Joi.string().required(),
    isEnabled: Joi.boolean(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

toyTypeSchema.plugin(mongooseLeanId)

toyTypeSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("ToyType", toyTypeSchema)
