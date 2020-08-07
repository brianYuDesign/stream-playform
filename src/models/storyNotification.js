import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"

Joi.objectId = JoiObjectId(Joi)

const storyNotificationSchema = new Schema(
  {
    latestStory: {
      type: Schema.Types.ObjectId,
      ref: "Story"
    },
    readUserList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
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

storyNotificationSchema.methods.joiValidate = obj => {
  const schema = {
    latestStory: Joi.objectId(),
    readUserList: Joi.array().items(Joi.objectId()),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

storyNotificationSchema.plugin(mongooseLeanId)

storyNotificationSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("StoryNotification", storyNotificationSchema)
