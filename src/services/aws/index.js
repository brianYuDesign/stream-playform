import env from "dotenv"
import AWS from "aws-sdk"

env.config()

const { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env
AWS.config.region = REGION
AWS.config.accessKeyId = AWS_ACCESS_KEY_ID
AWS.config.secretAccessKey = AWS_SECRET_ACCESS_KEY

export default AWS
