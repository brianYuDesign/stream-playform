import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const shareSchema = new Schema(
  {
    promotionCode: {
      type: String
    },
    source: {
      type: String
    },
    redirectUrl: {
      type: String
    },
    dealer: {
      type: Schema.Types.ObjectId,
      ref: "Dealer"
    },
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

shareSchema.methods.joiValidate = obj => {
  const schema = {
    promotionCode: Joi.string().required(),
    type: Joi.stirng().required(),
    dealer: Joi.objectId(),
    referrer: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

shareSchema.plugin(mongooseLeanId)

shareSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Share", shareSchema)
