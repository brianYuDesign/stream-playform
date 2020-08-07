import { withFilter } from "graphql-subscriptions"
import { pubsub } from "../../utils"
import { REALTIME_INFO } from "../../constants"

export default () => ({
  Subscription: {
    realtimeInfo: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([REALTIME_INFO]),
        () => true
      )
    }
  }
})
