import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const viewLogSchema = new Schema(
  {
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story"
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

viewLogSchema.methods.joiValidate = obj => {
  const schema = {
    story: Joi.objectId(),
    creator: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

viewLogSchema.plugin(mongooseLeanId)

viewLogSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("ViewLog", viewLogSchema)
