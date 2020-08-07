import express from "express"
import bodyParser from "body-parser"
import env from "dotenv"
import { default as authMiddleware } from "../middleware/auth"
import helpers from "../helpers"
import { cloudFront } from "../services"
import { FILE_PATH_STORIES } from "../constants"

env.config()
const { CDN } = process.env

const jsonParser = bodyParser.json()
const storyController = express.Router()

storyController.post(
  "/pinnedStories",
  jsonParser,
  authMiddleware,
  async (req, res) => {
    try {
      const stories = await helpers.story.pinnedStories()
      const user = req.user

      const result = await Promise.all(
        stories.map(async story => {
          const resourceUrl = await helpers.story.getResourceUrl({
            story,
            user
          })

          return {
            ...story,
            thumbnailUrl: `${CDN}${FILE_PATH_STORIES}/origin/${story.number}/${story.number}.jpg`,
            resourceUrl
          }
        })
      )

      const endPoints = result.map(item => {
        const fileName = item.resourceUrl.substring(
          item.resourceUrl.lastIndexOf("/") + 1
        )
        const filePath = item.resourceUrl.replace(fileName, "*")
        return filePath
      })

      cloudFront.getMultiResource(endPoints, res)

      res.send(result)
    } catch (error) {
      res.send(error.message)
    }
  }
)

storyController.post("/:id", jsonParser, authMiddleware, async (req, res) => {
  try {
    const storyId = req.params.id
    const story = await helpers.story.getById(storyId)

    const user = req.user
    const resourceUrl = await helpers.story.getResourceUrl({ story, user }, res)
    res.send({ ...story, resourceUrl })
  } catch (error) {
    res.send(error.message)
  }
})

export default storyController
