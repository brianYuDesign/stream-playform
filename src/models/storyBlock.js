import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const storyBlockSchema = new Schema(
  {
    name: {
      type: String
    },
    enName: {
      type: String
    },
    order: {
      type: Number
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "StoryBlock"
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

storyBlockSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    enName: Joi.string().required(),
    order: Joi.number(),
    isEnabled: Joi.boolean(),
    parent: Joi.objectId(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

storyBlockSchema.plugin(mongooseLeanId)

storyBlockSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("StoryBlock", storyBlockSchema)
