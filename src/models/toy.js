import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const toySchema = new Schema(
  {
    name: {
      type: String
    },
    enName: {
      type: String
    },
    photoUrl: {
      type: String
    },
    necessaryCoin: {
      type: Number
    },
    toyType: {
      type: Schema.Types.ObjectId,
      ref: "ToyType"
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updater: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

toySchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    enName: Joi.string().required(),
    photoUrl: Joi.string().required(),
    necessaryCoin: Joi.number().required(),
    toyType: Joi.objectId().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId(),
    isEnabled: Joi.boolean()
  }
  return Joi.joiValidate(obj, schema)
}

toySchema.plugin(mongooseLeanId)

toySchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Toy", toySchema)
