import Redis from "ioredis"
import redis from "redis-mock"
import env from "dotenv"

env.config()
const { REDIS_HOST, REDIS_PORT, NODE_ENV } = process.env

let redisClient =
  NODE_ENV === "TEST"
    ? redis.createClient()
    : new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT
      })

redisClient.on("error", e => {
  throw new Error(e)
})

export default redisClient
