// import Intercom from "intercom-client"
const Intercom = require("intercom-client")

const client = new Intercom.Client({
  token: "dG9rOjI2NjI4NTRkXzc1ZjRfNDg5MF84YTNmXzlhZDFlM2ViZmVkYzoxOjA="
})

const getUsers = async () => {
  return client.users
    .list()
    .then(e => e.body.users)
    .catch(error => {
      throw new Error(error)
    })
}

const getUserByUserId = async userId => {
  return (await getUsers()).find(item => item.user_id === userId)
}

const createMessage = async ({ clientId, body }) => {
  await client.messages.create({
    message_type: "inapp",
    body,
    template: "plain",
    from: {
      type: "admin",
      id: "3794230"
    },
    to: {
      type: "user",
      id: clientId
    }
  })
}

export default { getUsers, getUserByUserId, createMessage }
