import promotionGenerate from "./promotionGenerate"
import rewardGenerate from "./rewardGenerate"
import roleFeatureGenerate from "./roleFeatureGenerate"
import storyBlockGenerate from "./storyBlockGenerate"
import storyTagGenerate from "./storyTagGenerate"
import storyGenerate from "./storyGenerate"
import storyNotificationGenerate from "./storyNotificationGenerate"
import featureGenerate from "./featureGenerate"
import coinGenerate from "./coinGenerate"
import dealerGenerate from "./dealerGenerate"
import toyGenerate from "./toyGenerate"
import toyTypeGenerate from "./toyTypeGenerate"
import bannerGenerate from "./bannerGenerate"
import helpers from "../helpers"

export default {
  async generate() {
    await this.generateUserAndRoleFeature()
    const user = await helpers.user.getOne({
      roleFeature: await helpers.roleFeature.getRoleAdminId()
    })
    await this.generateExampleData(user)
  },
  generateUserAndRoleFeature: async () => {
    if ((await helpers.roleFeature.getAll()).length === 0) {
      await roleFeatureGenerate()
    }

    if ((await helpers.dealer.getAll()).length === 0) {
      await dealerGenerate()
    }

    if (
      (
        await helpers.user.getByFilter({
          roleFeature: await helpers.roleFeature.getRoleAdminId()
        })
      ).length === 0
    ) {
      await helpers.user.createUser({
        input: {
          email: "brian.yu1@4idps.com",
          phoneNumber: "+886961134525",
          name: "brianBack",
          uid: "brianBack",
          roleFeature: await helpers.roleFeature.getRoleAdminId(),
          isEnabled: true
        }
      })
      await helpers.user.createUser({
        input: {
          email: "wunhow1@4idps.com",
          phoneNumber: "+886961134525",
          name: "wunhowBack",
          uid: "wunhowBack",
          roleFeature: await helpers.roleFeature.getRoleAdminId(),
          isEnabled: true
        }
      })
    }

    if (
      (
        await helpers.user.getByFilter({
          roleFeature: await helpers.roleFeature.getRoleDealerId()
        })
      ).length === 0
    ) {
      await helpers.user.createUser({
        input: {
          email: "jianyufen6161@gmail.com",
          phoneNumber: "+886928342401",
          name: "jian",
          uid: "jian",
          roleFeature: await helpers.roleFeature.getRoleDealerId(),
          dealer: (await helpers.dealer.getAll())[0].id,
          isEnabled: true
        }
      })
    }

    if (
      (
        await helpers.user.getByFilter({
          roleFeature: await helpers.roleFeature.getRoleClientId()
        })
      ).length === 0
    ) {
      await helpers.user.createUser({
        input: {
          email: "kgcm.optimus1@gmail.com",
          password: "a53117492",
          name: "kgcm.optimus",
          uid: "kgcmoptimus",
          roleFeature: await helpers.roleFeature.getRoleClientId(),
          isEnabled: true
        }
      })
      await helpers.user.createUser({
        input: {
          email: "bruno.chami1@4idps.com",
          password: "apple1994",
          name: "bruno",
          uid: "bruno",
          roleFeature: await helpers.roleFeature.getRoleArtistId(),
          isEnabled: true
        }
      })
      await helpers.user.createUser({
        input: {
          email: "brian8311211@gmail.com",
          password: "apple1994",
          name: "brianFront",
          uid: "brianFront",
          roleFeature: await helpers.roleFeature.getRoleClientId(),
          isEnabled: true
        }
      })
    }

    if (
      (
        await helpers.user.getByFilter({
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      ).length === 0
    ) {
      await userGenerate()
    }
  },
  generateExampleData: async adminUser => {
    if (!adminUser) {
      return
    }

    if ((await helpers.reward.getAll()).length === 0) {
      await rewardGenerate(adminUser)
    }

    if ((await helpers.promotion.getAll()).length === 0) {
      await promotionGenerate(adminUser, await helpers.reward.getAll())
    }

    if ((await helpers.banner.getAll()).length === 0) {
      await bannerGenerate(adminUser)
    }
    if ((await helpers.storyBlock.getAll()).length === 0) {
      await storyBlockGenerate(adminUser)
    }

    if ((await helpers.storyTag.getAll()).length === 0) {
      await storyTagGenerate(adminUser)
    }

    if ((await helpers.story.getAll()).length === 0) {
      await storyGenerate(
        await helpers.user.getByFilter({
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      )
      if ((await helpers.storyNotification.getAll()).length === 0) {
        await storyNotificationGenerate(
          await helpers.user.getByFilter({
            roleFeature: await helpers.roleFeature.getRoleArtistId()
          })
        )
      }
    }

    if ((await helpers.coin.getAll()).length === 0) {
      await coinGenerate(adminUser)
    }

    if ((await helpers.feature.getAll()).length === 0) {
      await featureGenerate(adminUser)
      const featureIds = (await helpers.feature.getAll())
        .filter(item => item.featureCode !== "dealer")
        .map(item => item.id)
      await helpers.roleFeature.update({
        id: await helpers.roleFeature.getRoleAdminId(),
        input: { features: featureIds }
      })

      await helpers.roleFeature.update({
        id: await helpers.roleFeature.getRoleManagerId(),
        input: { features: featureIds }
      })
    }

    if ((await helpers.toyType.getAll()).length === 0) {
      await toyTypeGenerate(adminUser)
    }

    if ((await helpers.toy.getAll()).length === 0) {
      await toyGenerate(adminUser)
    }
  }
}
