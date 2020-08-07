import env from "dotenv"
import AWS from "."

env.config()
const { BUCKET_NAME } = process.env

const s3 = new AWS.S3({
  apiVersion: "2006-03-01"
})

const listObjects = () => {
  try {
    const params = {
      Bucket: BUCKET_NAME
    }
    return s3.listObjects(params).promise()
  } catch (error) {
    throw new Error(error)
  }
}

const deleteObject = async filePath => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: filePath
    }
    return s3.deleteObject(params).promise()
  } catch (error) {
    throw new Error(error)
  }
}

const storeFileToS3 = async ({
  filePath,
  file,
  newFileName,
  validateTypes
}) => {
  try {
    const { createReadStream, filename, mimetype } = file
    if (validateTypes && !validateTypes.includes(mimetype)) {
      throw new Error(
        `檔案格式不正確 僅接受 ${validateTypes.map(item => `${item} `)} 格式`
      )
    }

    const s3FileName = newFileName || Date.now() + filename.replace(/ /g, "_")

    const params = {
      Body: createReadStream(),
      Bucket: BUCKET_NAME,
      Key: `${filePath}/${s3FileName}`
    }

    await s3.upload(params).promise()

    return `${filePath}/${s3FileName}`
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  listObjects,
  deleteObject,
  storeFileToS3
}
