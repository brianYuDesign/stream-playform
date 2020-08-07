import mongoose from "mongoose"
import env from "dotenv"
import { slackNotification } from "../utils"

env.config()
const { NODE_ENV, DB_HOST } = process.env

mongoose.Promise = global.Promise

mongoose
  .connect(DB_HOST, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log(`Connected to mongo at ${DB_HOST}`))
  .catch(error => {
    console.log(`DB Connection Error: ${error.message}`)
  })

// slackNotification(
//   ` Connected ${NODE_ENV} DB ${DB_HOST}_${new Date().toLocaleString("zh-TW", {
//     timeZone: "Asia/Taipei"
//   })}`
// )
