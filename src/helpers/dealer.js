import { s3Service } from "../services"
import { FILE_PATH_DEALERS_CONTRACT } from "../constants"
import dataProvider from "../data-provider"

export default {
  ...dataProvider.dealer,
  createDealer: async ({ input, user }) =>
    dataProvider.dealer.create({
      user,
      input: {
        ...input,
        ...(input.file && {
          contractUrl: await s3Service.storeFileToS3({
            filePath: FILE_PATH_DEALERS_CONTRACT,
            file: await input.file
          })
        })
      }
    }),
  updateDealer: async ({ id, input, user }) =>
    dataProvider.dealer.update({
      id,
      user,
      input: {
        ...input,
        ...(input.file && {
          contractUrl: await s3Service.storeFileToS3({
            filePath: FILE_PATH_DEALERS_CONTRACT,
            file: await input.file
          })
        })
      }
    })
}
