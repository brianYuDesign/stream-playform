import { typeDefs } from "graphql-scalars"
import Root from "./root"
import Archive from "./archive"
import Banner from "./banner"
import Chatmessage from "./chatmessage"
import Chatroom from "./chatroom"
import Coin from "./coin"
import Configuration from "./configuration"
import ConsumeHistory from "./consumeHistory"
import Dealer from "./dealer"
import Feature from "./feature"
import Lang from "./lang"
import LoginHistory from "./loginHistory"
import Order from "./order"
import Promotion from "./promotion"
import RealtimeInfo from "./realtimeInfo"
import Ranking from "./ranking"
import Report from "./report"
import Record from "./record"
import Reward from "./reward"
import RoleFeature from "./roleFeature"
import Story from "./story"
import StoryBlock from "./storyBlock"
import StoryNotification from "./storyNotification"
import StoryTag from "./storyTag"
import Subscribe from "./subscribe"
import Toy from "./toy"
import ToyType from "./toyType"
import User from "./user"
import ViewLog from "./viewLog"
import Voucher from "./voucher"

export default [
  ...typeDefs,
  Root,
  Archive,
  Banner,
  Chatmessage,
  Chatroom,
  Coin,
  Configuration,
  ConsumeHistory,
  Dealer,
  Feature,
  Lang,
  LoginHistory,
  Order,
  Promotion,
  Ranking,
  RealtimeInfo,
  Record,
  Report,
  Reward,
  RoleFeature,
  Story,
  StoryBlock,
  StoryNotification,
  StoryTag,
  Subscribe,
  Toy,
  ToyType,
  User,
  ViewLog,
  Voucher
]
