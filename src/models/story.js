import mongoose, { Schema } from "mongoose"
import Joi from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import mongoosePaginate from "mongoose-paginate-v2"
import {
  STORY_TYPE_LIST,
  STORY_STATUS_LIST,
  STORY_STATUS_CREATED
} from "../constants"

Joi.objectId = JoiObjectId(Joi)

const storySchema = new Schema(
  {
    number: {
      type: String
    },
    type: {
      type: String,
      enum: STORY_TYPE_LIST
    },
    status: {
      type: String,
      enum: STORY_STATUS_LIST,
      default: STORY_STATUS_CREATED
    },
    content: {
      type: String
    },
    downloadUrl: {
      type: String
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    publishTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    necessaryCoin: {
      type: Number
    },
    fakeViews: {
      type: Number,
      default: 0
    },
    storyBlock: {
      type: Schema.Types.ObjectId,
      ref: "StoryBlock"
    },
    storyTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoryTag"
      }
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    updater: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    lastUploadTime: {
      type: Date
    }
  },
  { timestamps: true }
)

storySchema.methods.joiValidate = obj => {
  const schema = {
    number: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.string().required(),
    content: Joi.string().required(),
    downloadUrl: Joi.string(),
    isPinned: Joi.boolean(),
    publishTime: Joi.date(),
    endTime: Joi.date(),
    necessaryCoin: Joi.number().required(),
    fakeViews: Joi.number(),
    storyBlock: Joi.objectId(),
    storyTags: Joi.array().items(Joi.objectId()),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

storySchema.plugin(mongooseLeanId)
storySchema.plugin(mongoosePaginate)

storySchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("Story", storySchema)
