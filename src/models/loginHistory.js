import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const loginHistorySchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

loginHistorySchema.methods.joiValidate = obj => {
  const schema = {
    creator: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

loginHistorySchema.plugin(mongooseLeanId)

loginHistorySchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("LoginHistory", loginHistorySchema)
