import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import { REWARD_TYPE_LIST } from "../constants"

Joi.objectId = JoiObjectId(Joi)

const rewardSchema = new Schema(
  {
    type: {
      type: String,
      enum: REWARD_TYPE_LIST
    },
    reward: {
      type: Number
    },
    requiredPrice: {
      type: Number
    },
    description: {
      type: String
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

rewardSchema.methods.joiValidate = obj => {
  const schema = {
    type: Joi.string().required(),
    reward: Joi.number().required(),
    requiredPrice: Joi.number(),
    description: Joi.string(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

rewardSchema.plugin(mongooseLeanId)

rewardSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Reward", rewardSchema)
