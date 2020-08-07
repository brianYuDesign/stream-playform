const { WebClient } = require("@slack/web-api")

const web = new WebClient(
  "xoxp-3333435963-3333435979-828483881011-7f010ff6c6fb773d1b93b1124f3a3e04"
)
export default async message => {
  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  await web.chat.postMessage({
    text: message,
    channel: "GQQ2E2KA6"
  })
}
