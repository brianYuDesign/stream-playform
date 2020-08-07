import { before } from "mocha"
import { expect } from "chai"
import { hash, compare } from "bcrypt"
import helpers from "../../src/helpers"
import {
  DEALER,
  USER_INVOICE_PERSONAL,
  USER_SOURCE_BACK,
  USER_SCOPE_BACK,
  USER_SCOPE_FRONT,
  CHARACTER_LENGTH,
  CHARACTER,
  USER_SOURCE_GOOGLE,
  USER_SOURCE_FACEBOOK
} from "../../src/constants"
import { log } from "util"

let user,
  roleFeature,
  dealer,
  SALT_ROUNDS = 10

before(async () => {
  roleFeature = await helpers.roleFeature.create({
    input: { name: DEALER, displayName: "經銷商" }
  })
  dealer = await helpers.dealer.create({
    input: {
      ban: "53117492",
      name: "經銷商",
      owner: "B",
      email: "dealerb@dealer.com",
      address: "DealerB地址",
      phoneNumber: "0912345666",
      profitPercentSetting: 20,
      contractUrl: "dealersContract/test02/4idps.jpeg"
    }
  })
})

describe("helpers-user", async () => {
  it("searchArtists", async () => {
    user = await helpers.user.getOne({ name: "bruno" })

    const results = user
      ? await helpers.user.getByFilter({
          uid: { $regex: user.uid, $options: "i" },
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      : await helpers.user.getByFilter({
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })

    results.reverse()

    const result = await helpers.user.searchArtists({
      pageSize: 10,
      results
    })

    expect(result.totalCount).to.equal(1)
  })

  it("searchDealerUsers", async () => {
    user = await helpers.user.getOne({ name: "jian" })
    const results = user
      ? await helpers.user.getByFilter({
          uid: { $regex: user.uid, $options: "i" },
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleDealerId()
        })
      : await helpers.user.getByFilter({
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleDealerId()
        })

    results.reverse()

    const result = await helpers.user.searchDealerUsers({
      pageSize: 10,
      results
    })

    expect(result.totalCount).to.equal(1)
  })

  it("artists", async () => {
    user = await helpers.user.getOne({ name: "bruno" })
    const results =
      user.roleFeature === (await helpers.roleFeature.getRoleDealerId())
        ? await helpers.user.getByFilter({
            roleFeature: await helpers.roleFeature.getRoleArtistId(),
            dealer: user.dealer
          })
        : await helpers.user.getByFilter({
            roleFeature: await helpers.roleFeature.getRoleArtistId()
          })

    const result = await helpers.user.artists({
      user,
      pageSize: 10,
      results
    })

    expect(result.totalCount).to.equal(1)
  })

  it("searchDateableArtists", async () => {
    user = await helpers.user.getOne({ name: "bruno" })
    const results = user
      ? await helpers.user.getByFilter({
          uid: { $regex: user.uid, $options: "i" },
          isDateabled: true,
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      : await helpers.user.getByFilter({
          isDateabled: true,
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
    results.reverse()

    const result = await helpers.user.searchDateableArtists({
      pageSize: 10,
      results
    })

    expect(result.totalCount).to.equal(0)
  })

  it("searchUsers", async () => {
    user = await helpers.user.getOne({ name: "jian" })
    const results = user
      ? await helpers.user.getByFilter({
          uid: { $regex: user.uid, $options: "i" },
          isEnabled: true
        })
      : await helpers.user.getByFilter({
          isEnabled: true
        })
    results.reverse()

    const result = await helpers.user.searchUsers({
      pageSize: 10,
      results
    })

    expect(result.totalCount).to.equal(7)
  })

  it("createUser", async () => {
    try {
      const clientId = await helpers.roleFeature.getRoleClientId()
      const artistId = await helpers.roleFeature.getRoleArtistId()

      const input = {
        isEnabled: true,
        isUidModified: false,
        isPasswordNeedToChange: true,
        coin: 5119022,
        invoiceType: "LOVE",
        // uid: "05ig6f",
        email: "kai12@gmail.com",
        recipientEmail: "kai12@hotmail.com",
        source: "CUSTOM",
        scope: "FRONT_ONLY",
        promotionCode: "khe8um",
        avatar: "https://reurl.cc/arapX4",
        background: "https://reurl.cc/arapX4",
        description: "hihi",
        password: "apple1994"
      }
      if (await helpers.user.getOne({ email: input.email })) {
        throw new Error("email is already exist")
      }
      const newUser = await helpers.user.createUser({
        input: {
          ...input,
          recipientEmail: input.email,
          uid: await helpers.user.generateUniqueUid(),
          promotionCode: await helpers.user.generateUniquePromotionCode(),
          source: USER_SOURCE_BACK,
          scope:
            input.roleFeature === clientId || input.roleFeature === artistId
              ? USER_SCOPE_FRONT
              : USER_SCOPE_BACK,
          password: await hash(
            input.dealer
              ? (await helpers.dealer.getById(input.dealer)).ban
              : input.password || "apple1994",
            SALT_ROUNDS
          ),
          isPasswordNeedToChange: true
        },
        user
      })
      expect(newUser).to.have.property("id")
    } catch (error) {
      throw new Error(error)
    }
  })

  it("updateUser", async () => {
    const clientId = await helpers.roleFeature.getRoleClientId()
    const artistId = await helpers.roleFeature.getRoleArtistId()
    const userUpdateInput = {
      password: "banana1994"
    }
    const user = await helpers.user.getOne({
      email: "kai12@gmail.com"
    })
    if (userUpdateInput.password) {
      const updateUser = await helpers.user.updateUser({
        id: user.id,
        input: {
          ...user,
          ...(userUpdateInput.password && {
            password: await hash(userUpdateInput.password, SALT_ROUNDS),
            isPasswordNeedToChange: false
          }),
          scope:
            user.roleFeature === clientId || user.roleFeature === artistId
              ? USER_SCOPE_FRONT
              : USER_SCOPE_BACK
        },
        user
      })
      expect(updateUser).to.have.property("id")
      expect(updateUser.email).to.be.equal("kai12@gmail.com")
    }
  })

  it("generateUniqueUid", async () => {
    let result = ""
    for (let i = 0; i < 6; i += 1) {
      result += CHARACTER.charAt(Math.floor(Math.random() * CHARACTER_LENGTH))
    }

    if (await helpers.user.isUidValueExist(result)) {
      return helpers.user.generateUniqueUid()
    }

    expect(await helpers.user.generateUniqueUid()).to.be.a("string")
  })

  it("updateUserUid", async () => {
    user = await helpers.user.getOne({ name: "brianBack" })

    if (user.isUidModified) {
      throw new Error("uid已經更改過，無法再次修改")
    }
    expect(user.isUidModified).to.be.false
  })

  it("isUidValueExist", async () => {
    const uid = (await helpers.user.getOne({ name: "brianFront" })).uid
    const updateUser = await helpers.user.isUidValueExist(uid)
    expect(updateUser).to.be.true
  })

  it("isPromotionCodeExist", async () => {
    const promotionCode = (await helpers.user.getOne({ name: "brianFront" }))
      .promotionCode
    const updateUser = await helpers.user.isUidValueExist(promotionCode)
    expect(updateUser).to.be.false
  })

  it("upsertGoogleUser", async () => {
    user = await helpers.user.getOne({ name: "brianBack" })

    const targetGoogleUser = await helpers.user.createUser({
      input: {
        uid: await helpers.user.generateUniqueUid(),
        name: "kai",
        email: "kkk@gmail.com",
        recipientEmail: "kkk@gmail.com",
        scope: USER_SCOPE_FRONT,
        source: USER_SOURCE_GOOGLE,
        roleFeature: await helpers.roleFeature.getRoleClientId(),
        promotionCode: await helpers.user.generateUniquePromotionCode(),
        coin: 5200000,
        googleId: user.id,
        isEnabled: true,
        isPasswordNeedToChange: false,
        uid: await helpers.user.generateUniqueUid(),
        promotionCode: await helpers.user.generateUniquePromotionCode(),
        password: await hash(
          user.dealer
            ? (await helpers.dealer.getById(user.dealer)).ban
            : user.password || "apple1994",
          SALT_ROUNDS
        ),
        isPasswordNeedToChange: true
      }
    })

    const upsertGoogleUser = await helpers.user.upsertGoogleUser(
      targetGoogleUser
    )
    const googleUser = await helpers.user.getOne({ name: "kai" })

    expect(upsertGoogleUser.googleId).to.equal(googleUser.googleId)
  })
  // it("upsertFacebookUser", async () => {
  //   user = await helpers.user.getOne({ name: "bruno" })

  //   const targetFacebookUser = await helpers.user.createUser({
  //     input: {
  //       uid: await helpers.user.generateUniqueUid(),
  //       name: "kai",
  //       email: "kai123@gmail.com",
  //       recipientEmail: "kkk@gmail.com",
  //       scope: USER_SCOPE_FRONT,
  //       source: USER_SOURCE_FACEBOOK,
  //       roleFeature: await helpers.roleFeature.getRoleClientId(),
  //       promotionCode: await helpers.user.generateUniquePromotionCode(),
  //       coin: 5200000,
  //       facebookId: user.id,
  //       isEnabled: true,
  //       isPasswordNeedToChange: false,
  //       uid: await helpers.user.generateUniqueUid(),
  //       promotionCode: await helpers.user.generateUniquePromotionCode(),
  //       password: await hash(
  //         user.dealer
  //           ? (await helpers.dealer.getById(user.dealer)).ban
  //           : user.password || "apple1994",
  //         SALT_ROUNDS
  //       ),
  //       isPasswordNeedToChange: true
  //     }
  //   })

  //   const upsertFacebookUser = await helpers.user.upsertFacebookUser(
  //     targetFacebookUser
  //   )
  // const googleUser = await helpers.user.getOne({ name: "kai" })

  // expect(upsertFacebookUser.facebookId).to.equal(googleUser.facebookId)
  // })

  it("updateUserInfo", async () => {
    let password = "gerkmgrekgmlremgre"
    expect(user.password).to.not.equal(password)
  })
})
