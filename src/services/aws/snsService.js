import AWS from "."

const sns = new AWS.SNS({ region: "ap-northeast-1" })

// const params = {
//   Message: "這是透過 Node.js AWS SDK 發送的簡訊",
//   PhoneNumber: "+88691********"
// }

const sendSNS = params => {
  sns.publish(params, (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })
}

export default { sendSNS }
