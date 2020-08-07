import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const storyTagSchema = new Schema(
  {
    name: {
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

storyTagSchema.methods.joiValidate = obj => {
  const schema = {
    name: Joi.string().required(),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

storyTagSchema.plugin(mongooseLeanId)

storyTagSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("StoryTag", storyTagSchema)
