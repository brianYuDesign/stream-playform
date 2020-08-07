import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const featureSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    featureCode: {
      type: String,
      require: true,
      unique: true
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

featureSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    featureCode: Joi.string().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

featureSchema.plugin(mongooseLeanId)

featureSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Feature", featureSchema)
