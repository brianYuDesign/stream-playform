import env from "dotenv"
import nodemailer from "nodemailer"
import redisClient from "../redis/connection"

env.config()
const { NODE_ENV } = process.env
const {
  SEND_EMAIL_FROM,
  SYSTEM_EMAIL_ADDRESS,
  SYSTEM_EMAIL_PASSWORD
} = process.env

export default async ({ event, email, subject, content }) => {
  if (NODE_ENV !== "TEST") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SYSTEM_EMAIL_ADDRESS,
        pass: SYSTEM_EMAIL_PASSWORD
      }
    })

    transporter.sendMail(
      {
        from: SEND_EMAIL_FROM,
        to: email,
        subject,
        text: content
      },
      (error, info) => {
        if (error) {
          throw new Error(error)
        } else {
          console.log(`[${event}]${email} sent:${info.response}`)
        }
      }
    )
  }
}
