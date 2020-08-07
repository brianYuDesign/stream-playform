import { s3Service } from "../services"
import {
  FILE_PATH_TOYS,
  FILE_TYPE_PNG,
  FILE_TYPE_JPG,
  FILE_TYPE_JPEG
} from "../constants"
import dataProvider from "../data-provider"

export default {
  ...dataProvider.toy,
  createToy: async ({ input, user }) =>
    dataProvider.toy.create({
      id: newToy.id,
      user,
      input: {
        ...input,
        ...(input.file && {
          photoUrl: await s3Service.storeFileToS3({
            filePath: `${FILE_PATH_TOYS}`,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.file
          })
        })
      }
    }),
  updateToy: async ({ id, input, user }) =>
    dataProvider.toy.update({
      id,
      user,
      input: {
        ...input,
        ...(input.file && {
          photoUrl: await s3Service.storeFileToS3({
            filePath: `${FILE_PATH_TOYS}`,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.file
          })
        })
      }
    })
}
