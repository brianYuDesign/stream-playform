import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const roleFeatureSchema = new Schema(
  {
    name: {
      type: String
    },
    displayName: {
      type: String
    },
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feature"
      }
    ],
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

roleFeatureSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    displayName: Joi.string(),
    features: Joi.array().items(Joi.objectId()),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

roleFeatureSchema.plugin(mongooseLeanId)

roleFeatureSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("RoleFeature", roleFeatureSchema)
