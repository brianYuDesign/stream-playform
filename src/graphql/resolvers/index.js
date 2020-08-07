import { resolvers } from "graphql-scalars"
import Archive from "./archive"
import Banner from "./banner"
import Chatmessage from "./chatmessage"
import Chatroom from "./chatroom"
import Coin from "./coin"
import Configuration from "./configuration"
import ConsumeHistory from "./consumeHistory"
import Dealer from "./dealer"
import Feature from "./feature"
import LoginHistory from "./loginHistory"
import Order from "./order"
import Promotion from "./promotion"
import Ranking from "./ranking"
import RealtimeInfo from "./realtimeInfo"
import Record from "./record"
import Report from "./report"
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
import helpers from "../../helpers"

export default [
  resolvers,
  Archive(helpers),
  Banner(helpers),
  Chatmessage(helpers),
  Chatroom(helpers),
  Coin(helpers),
  Configuration(helpers),
  ConsumeHistory(helpers),
  Dealer(helpers),
  Feature(helpers),
  LoginHistory(helpers),
  Order(helpers),
  Promotion(helpers),
  Ranking(helpers),
  RealtimeInfo(helpers),
  Record(helpers),
  Report(helpers),
  Reward(helpers),
  RoleFeature(helpers),
  Story(helpers),
  StoryBlock(helpers),
  StoryNotification(helpers),
  StoryTag(helpers),
  Subscribe(helpers),
  Toy(helpers),
  ToyType(helpers),
  User(helpers),
  ViewLog(helpers),
  Voucher(helpers)
]
