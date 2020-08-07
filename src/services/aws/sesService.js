import AWS from "."

// Create sendEmail params
const emailParams = ({ toAddresses, subject, type, content }) => ({
  Destination: {
    ToAddresses: toAddresses
  },
  ReplyToAddresses: ["brian.yu@4idps.com"],
  Message: {
    Body: {
      ...(type === "HTML"
        ? {
            Html: {
              Charset: "UTF-8",
              Data: content
            }
          }
        : {
            Text: {
              Charset: "UTF-8",
              Data: content
            }
          })
    },
    Subject: {
      Charset: "UTF-8",
      Data: subject
    }
  },
  Source: "brian.yu@4idps.com"
})
const ses = new AWS.SES({ region: "ap-northeast-1" })

const sendSES = params =>
  ses.sendEmail(emailParams(params), (err, data) => {
    if (err) console.log(err, err.stack)
    else console.log(data)
  })

export default { sendSES }
