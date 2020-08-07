import mongoose, { Schema } from "mongoose"
import Joi, { number } from "joi"
import JoiObjectId from "joi-objectid"
import mongooseLeanId from "mongoose-lean-id"
import mongoosePaginate from "mongoose-paginate-v2"
import {
  USER_GENDER_LIST,
  USER_FOLLOW_STATUS_LIST,
  USER_SUBSCRIBE_STATUS_LIST,
  USER_BLOCK_STATUS_LIST,
  USER_SOURCE_LIST,
  USER_INVOICE_LIST,
  USER_INVOICE_LOVE,
  USER_SCOPE_LIST
} from "../constants"

Joi.objectId = JoiObjectId(Joi)

const userSchema = new Schema(
  {
    uid: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    description: {
      type: String
    },
    gender: {
      type: String,
      enum: USER_GENDER_LIST
    },
    sexualOrientation: [
      {
        type: String,
        enum: USER_GENDER_LIST
      }
    ],
    birthday: {
      type: Date
    },
    promotionCode: {
      type: String
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    isDateabled: {
      type: Boolean
    },
    isUidModified: {
      type: Boolean,
      default: false
    },
    isPasswordNeedToChange: {
      type: Boolean,
      default: true
    },
    coin: {
      type: Number,
      default: 0,
      min: 0
    },
    facebookId: {
      type: String
    },
    googleId: {
      type: String
    },
    source: {
      type: String,
      enum: USER_SOURCE_LIST
    },
    scope: {
      type: String,
      enum: USER_SCOPE_LIST
    },
    avatar: {
      type: String
    },
    background: {
      type: String
    },
    recipientEmail: {
      type: String
    },
    invoiceType: {
      type: String,
      enum: USER_INVOICE_LIST,
      default: USER_INVOICE_LOVE
    },
    invoiceBuyer: {
      type: String
    },
    invoicePhoneNumber: {
      type: String
    },
    invoiceAddress: {
      type: String
    },
    loginFailedTime: {
      type: Number
    },
    loginBlockUntil: {
      type: Date
    },
    roleFeature: {
      type: Schema.Types.ObjectId,
      ref: "RoleFeature"
    },
    dealer: {
      type: Schema.Types.ObjectId,
      ref: "Dealer"
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        target: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: USER_FOLLOW_STATUS_LIST
        },
        followAt: {
          type: Date,
          default: Date.now()
        },
        unfollowAt: {
          type: Date
        }
      }
    ],
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    subscribing: [
      {
        target: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: USER_SUBSCRIBE_STATUS_LIST
        },
        subscribeAt: {
          type: Date
        },
        unsubscribeAt: {
          type: Date
        }
      }
    ],
    blockers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    blocking: [
      {
        target: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        status: {
          type: String,
          enum: USER_BLOCK_STATUS_LIST
        },
        blockAt: {
          type: Date,
          default: Date.now()
        },
        unblockAt: {
          type: Date
        }
      }
    ],
    manageArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    verifyCode: {
      type: String
    },
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User"
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

userSchema.methods.joiValidate = obj => {
  const schema = {
    uid: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string(),
    name: Joi.string(),
    phoneNumber: Joi.string(),
    gender: Joi.string(),
    sexualOrientation: Joi.array().items(Joi.string()),
    birthday: Joi.date(),
    source: Joi.string(),
    scope: Joi.string(),
    avatar: Joi.string(),
    background: Joi.string(),
    description: Joi.string(),
    promotionCode: Joi.string(),
    isEnabled: Joi.boolean(),
    isDateabled: Joi.boolean(),
    isUidModified: Joi.boolean(),
    isPasswordNeedToChange: Joi.boolean(),
    coin: Joi.number(),
    recipientEmail: Joi.string(),
    invoiceType: Joi.string(),
    invoiceBuyer: Joi.string(),
    invoicePhoneNumber: Joi.string(),
    invoiceAddress: Joi.string(),
    roleFeature: Joi.objectId(),
    dealer: Joi.objectId(),
    following: Joi.array(),
    followers: Joi.array().items(Joi.objectId()),
    subscribing: Joi.array(),
    subscribers: Joi.array().items(Joi.objectId()),
    blocking: Joi.array(),
    blockers: Joi.array().items(Joi.objectId()),
    manageArtists: Joi.array().items(Joi.objectId()),
    badges: Joi.array().items(Joi.objectId()),
    vouchers: Joi.array().items(Joi.objectId()),
    creator: Joi.objectId(),
    updater: Joi.objectId()
  }
  return Joi.joiValidate(obj, schema)
}

userSchema.plugin(mongooseLeanId)
userSchema.plugin(mongoosePaginate)

userSchema.set("toJSON", {
  virtuals: true
})

export default mongoose.model("User", userSchema)
