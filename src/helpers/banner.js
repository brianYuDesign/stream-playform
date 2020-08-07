import { s3Service } from "../services"
import dataProvider from "../data-provider"
import {
  FILE_PATH_BANNERS,
  FILE_TYPE_JPG,
  FILE_TYPE_PNG,
  FILE_TYPE_JPEG
} from "../constants"

export default {
  ...dataProvider.banner,
  frontBanners: async () =>
    dataProvider.banner
      .getByFilter({
        startTime: {
          $lt: new Date()
        },
        endTime: {
          $gte: new Date()
        }
      })
      .sort({
        createdAt: "desc"
      }),
  createBanner: async ({ input, user }) =>
    dataProvider.banner.create({
      input: {
        ...input,
        ...(input.file && {
          photoUrl: await s3Service.storeFileToS3({
            filePath: FILE_PATH_BANNERS,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.file
          })
        })
      },
      user
    }),
  updateBanner: async ({ id, input, user }) =>
    dataProvider.banner.update({
      id,
      user,
      input: {
        ...input,
        ...(input.file && {
          photoUrl: await s3Service.storeFileToS3({
            filePath: FILE_PATH_BANNERS,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.file
          })
        })
      }
    })
}
