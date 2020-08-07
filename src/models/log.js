import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const logSchema = new Schema(
  {
    api: {
      type: String
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

logSchema.methods.joiValidate = obj => {
  const schema = {
    creator: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

logSchema.plugin(mongooseLeanId)

logSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Log", logSchema)
