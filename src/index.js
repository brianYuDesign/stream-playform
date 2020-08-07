import { ApolloServer } from "apollo-server-express"
import http from "http"
import express from "express"
import env from "dotenv"
import depthLimit from "graphql-depth-limit"
import rateLimit from "express-rate-limit"
import cors from "cors"
import helmet from "helmet"

import dataGenerate from "./data-generate"
import { winstonLogger, auth, slackNotification, errorHandler } from "./utils"
import typeDefs from "./graphql/typeDefs"
import resolvers from "./graphql/resolvers"
import "./database/config"
import "./schedules/schedule"
import {
  authController,
  shareController,
  orderController,
  reportController,
  storyController
} from "./controllers"
import helpers from "./helpers"

env.config()
const {
  NODE_ENV,
  HOST,
  PORT,
  ENGINE_API_KEY,
  FRONTEND_HOST,
  BACKOFFICE_HOST
} = process.env

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res, connection }) => {
    if (connection) {
      return connection.context
    }
    const accessToken = req.headers["access-token"]
    if (accessToken) {
      const user = await auth.validateAccessToken(accessToken)
      return {
        user,
        res
      }
    }
    return {}
  },
  subscriptions: {
    onConnect: async connectionParams => {
      if (!connectionParams.headers) {
        return {}
      }

      const accessToken = connectionParams.headers["access-token"]
      if (accessToken) {
        const user = await auth.validateAccessToken(accessToken)

        if (user && user.id) {
          // await helpers.realtime.addUserToRedisOnlineUserSet(user.id)
          return {
            user
          }
        }
      }
      return {}
    }
    // onDisconnect: async (_ws, context) => {
    //   const initialContext = await context.initPromise
    //   if (initialContext && typeof initialContext === "object") {
    //     const { user } = initialContext
    //     if (user && user.id) {
    //       // await helpers.realtime.removeUserToRedisOnlineUserSet(user.id)
    //     }
    //   }
    // }
  },
  debug: NODE_ENV !== "PROD",
  engine: {
    apiKey: ENGINE_API_KEY,
    schemaTag: "production",
    debugPrintReports: false
  },
  introspection: NODE_ENV !== "PROD",
  playground: NODE_ENV !== "PROD",
  validationRules: [depthLimit(4)],
  formatError: error => {
    winstonLogger.error({
      label: "graphql formatError",
      message: `${error.message}`
    })
    return error
  },
  onHealthCheck: () => {
    return new Promise((resolve, reject) => {
      if (true) {
        resolve()
      } else {
        reject()
      }
    })
  }
})

const app = express()

const authLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: {
    status: 429,
    error: "You are doing that too much. Please try again in 10 minutes."
  }
})

app.use(helmet.frameguard())

const corsOption = {
  origin: [FRONTEND_HOST, BACKOFFICE_HOST],
  credentials: true
}

app.use(cors(corsOption))

app.use("/order", orderController)
app.use("/auth", authLimit, authController)
app.use("/share", shareController)
app.use("/report", reportController)
app.use("/stories", storyController)
app.use(errorHandler)

server.applyMiddleware({ app, cors: corsOption })
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

console.log(`start ${NODE_ENV} server`, new Date())

// slackNotification(
//   `[${NODE_ENV}] start [Graphql port: ${PORT}]_${new Date().toLocaleString(
//     "zh-TW",
//     { timeZone: "Asia/Taipei" }
//   )} `
// )

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`)
  console.log(
    `🚀 Subscriptions ready at ws://${HOST}:${PORT}${server.subscriptionsPath}`
  )
})

helpers.configuration.setEnvConfiguration()
dataGenerate.generate()
