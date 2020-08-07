import {
  UserInputError,
  ForbiddenError,
  AuthenticationError
} from "apollo-server-core"
import { hash, compare } from "bcrypt"
import env from "dotenv"
import helpers from "."
import { paginate, stringCompare, sendEmail } from "../utils"
import { s3Service } from "../services"
import {
  USER_FOLLOW_STATUS_FOLLOW,
  USER_FOLLOW_STATUS_UNFOLLOW,
  USER_SUBSCRIBE_STATUS_SUBSCRIBE,
  USER_SUBSCRIBE_STATUS_UNSUBSCRIBE,
  USER_BLOCK_STATUS_BLOCK,
  USER_BLOCK_STATUS_UNBLOCK,
  FILE_PATH_USERS,
  CHARACTER,
  CHARACTER_LENGTH,
  USER_SOURCE_FACEBOOK,
  USER_SOURCE_GOOGLE,
  USER_INVOICE_PERSONAL,
  VOUCHER_SOURCE_FOLLOWING,
  VOUCHER_TYPE_UNLOCK_CHAT,
  VOUCHER_STATUS_ACTIVED,
  USER_SOURCE_BACK,
  USER_SCOPE_FRONT,
  USER_SCOPE_BACK,
  FILE_TYPE_PNG,
  FILE_TYPE_JPG,
  FILE_TYPE_JPEG,
  EMAIL_EVENT_FORGOT_PASSWORD,
  REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT,
  REDIS_SUBSCRIBEING_COIN
} from "../constants"
import dataProvider from "../data-provider"
import redisClient from "../redis/connection"

env.config()
const { SUBSCRIBEING_COIN, FOLLOWING_REWARD_OF_UNLOCK_CHAT } = process.env

const SALT_ROUNDS = 10

export default {
  ...dataProvider.user,
  searchArtists: async ({ filter, pageSize = 10, after }) => {
    const results = filter
      ? await dataProvider.user.getByFilter({
          uid: { $regex: filter.uid, $options: "i" },
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      : await dataProvider.user.getByFilter({
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
    results.reverse()
    const users = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      users,
      cursor: users.length ? users[users.length - 1].id : null,
      hasMore: users.length
        ? users[users.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  searchDealerUsers: async ({ filter, pageSize = 10, after }) => {
    const results = filter
      ? await dataProvider.user.getByFilter({
          uid: { $regex: filter.uid, $options: "i" },
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleDealerId()
        })
      : await dataProvider.user.getByFilter({
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleDealerId()
        })
    results.reverse()
    const users = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      users,
      cursor: users.length ? users[users.length - 1].id : null,
      hasMore: users.length
        ? users[users.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  artists: async ({ user, pageSize = 10, after }) => {
    const results =
      user.roleFeature === (await helpers.roleFeature.getRoleDealerId())
        ? await dataProvider.user.getByFilter({
            roleFeature: await helpers.roleFeature.getRoleArtistId(),
            dealer: user.dealer
          })
        : await dataProvider.user.getByFilter({
            roleFeature: await helpers.roleFeature.getRoleArtistId()
          })
    const users = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      users,
      cursor: users.length ? users[users.length - 1].id : null,
      hasMore: users.length
        ? users[users.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  users: async ({ filter, pageSize, pageNumber, user }) => {
    const dealerId = await helpers.roleFeature.getRoleDealerId()
    const results = await dataProvider.user.paginate(
      {
        ...(stringCompare(user.roleFeature, dealerId)
          ? {
              ...(filter &&
                filter.uid && {
                  uid: { $regex: filter.uid, $options: "i" }
                }),
              ...(filter &&
                filter.promotionCode && {
                  promotionCode: { $regex: filter.promotionCode, $options: "i" }
                }),
              ...(filter &&
                filter.referrer && {
                  referrer: filter.referrer
                }),
              dealer: user.dealer,
              roleFeature: await helpers.roleFeature.getRoleArtistId()
            }
          : {
              ...(filter &&
                filter.uid && {
                  uid: { $regex: filter.uid, $options: "i" }
                }),
              ...(filter &&
                filter.promotionCode && {
                  promotionCode: { $regex: filter.promotionCode, $options: "i" }
                }),
              ...(filter &&
                filter.roleFeature && {
                  roleFeature: filter.roleFeature
                }),
              ...(filter &&
                filter.dealer && {
                  dealer: filter.dealer
                }),
              ...(filter &&
                filter.referrer && {
                  referrer: filter.referrer
                })
            })
      },
      { pageSize, pageNumber, sort: { createdAt: "-1" } }
    )
    return {
      totalPage: results.totalPages,
      users: results.docs
    }
  },

  searchDateableArtists: async ({ filter, pageSize = 10, after }) => {
    const results = filter
      ? await dataProvider.user.getByFilter({
          uid: { $regex: filter.uid, $options: "i" },
          isDateabled: true,
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
      : await dataProvider.user.getByFilter({
          isDateabled: true,
          isEnabled: true,
          roleFeature: await helpers.roleFeature.getRoleArtistId()
        })
    results.reverse()
    const users = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      users,
      cursor: users.length ? users[users.length - 1].id : null,
      hasMore: users.length
        ? users[users.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  searchUsers: async ({ filter, pageSize = 10, after }) => {
    const results = filter
      ? await dataProvider.user.getByFilter({
          uid: { $regex: filter.uid, $options: "i" },
          isEnabled: true
        })
      : await dataProvider.user.getByFilter({
          isEnabled: true
        })
    results.reverse()
    const users = paginate({
      after,
      pageSize,
      results
    })
    return {
      totalCount: results.length,
      users,
      cursor: users.length ? users[users.length - 1].id : null,
      hasMore: users.length
        ? users[users.length - 1].id !== results[results.length - 1].id
        : false
    }
  },
  async createUser({ input, user }) {
    try {
      const clientId = await helpers.roleFeature.getRoleClientId()
      const artistId = await helpers.roleFeature.getRoleArtistId()

      if (await dataProvider.user.getOne({ email: input.email })) {
        throw new UserInputError("email is already exist")
      }

      const newUser = await dataProvider.user.create({
        input: {
          ...input,
          recipientEmail: input.email,
          uid: await this.generateUniqueUid(),
          promotionCode: await this.generateUniquePromotionCode(),
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

      sendEmail({
        event: EMAIL_EVENT_FORGOT_PASSWORD,
        email: input.email,
        subject: "您的FUCK後台密碼",
        content: `您的暫時密碼為${
          input.dealer
            ? (await helpers.dealer.getById(input.dealer)).ban
            : "apple1994"
        }`
      })

      return newUser
    } catch (error) {
      throw new Error(error)
    }
  },
  async updateUser({ id, input, user }) {
    const clientId = await helpers.roleFeature.getRoleClientId()
    const artistId = await helpers.roleFeature.getRoleArtistId()

    if (input.newPassword) {
      if (!input.originPassword) {
        throw new UserInputError("請輸入原始密碼")
      }
      try {
        const passwordIsValid = await compare(
          input.originPassword,
          user.password
        )

        if (!passwordIsValid) {
          throw new AuthenticationError("原始密碼輸入錯誤")
        }
      } catch (error) {
        throw new Error(error)
      }
    }

    return dataProvider.user.update({
      id,
      input: {
        ...input,
        ...(input.newPassword && {
          password: await hash(input.newPassword, SALT_ROUNDS),
          isPasswordNeedToChange: false
        }),
        scope:
          input.roleFeature === clientId || input.roleFeature === artistId
            ? USER_SCOPE_FRONT
            : USER_SCOPE_BACK
      },
      user
    })
  },
  async updateUserInfo({ input, user }) {
    if (
      input.invoiceType === USER_INVOICE_PERSONAL &&
      (!user.invoiceBuyer || !user.invoicePhoneNumber || !user.invoiceAddress)
    ) {
      throw new UserInputError("請先輸入買受人相關資料")
    }

    if (input.newPassword) {
      if (!input.originPassword) {
        throw new UserInputError("請輸入原始密碼")
      }
      try {
        const passwordIsValid = await compare(
          input.originPassword,
          user.password
        )

        if (!passwordIsValid) {
          throw new AuthenticationError("原始密碼輸入錯誤")
        }
      } catch (error) {
        throw new Error(error)
      }
    }

    let updateUser = await dataProvider.user.update({
      id: user.id,
      user,
      input: {
        ...input,
        ...(input.newPassword && {
          password: await hash(input.newPassword, SALT_ROUNDS),
          isPasswordNeedToChange: false
        }),
        updater: user.id
      }
    })

    if (input.avatarFile) {
      await s3Service.deleteObject(updateUser.avatar)

      updateUser = await dataProvider.user.update({
        id: user.id,
        user,
        input: {
          avatar: await s3Service.storeFileToS3({
            filePath: `${FILE_PATH_USERS}/${updateUser.uid}`,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.avatarFile
          })
        }
      })
    }

    if (input.backgroundFile) {
      await s3Service.deleteObject(updateUser.background)

      updateUser = await dataProvider.user.update({
        id: user.id,
        user,
        input: {
          background: await s3Service.storeFileToS3({
            filePath: `${FILE_PATH_USERS}/${updateUser.uid}`,
            validateTypes: [FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_JPEG],
            newFileName: `${Date.now()}.jpg`,
            file: await input.backgroundFile
          })
        }
      })
    }

    return updateUser
  },
  async updateUserUid({ input, user }) {
    if (user.isUidModified) {
      throw new ForbiddenError("uid已經更改過，無法再次修改")
    }

    if (await this.isUidValueExist(input.uid)) {
      throw new UserInputError("uid不存在")
    }

    return dataProvider.user.update({
      id: user.id,
      user,
      input: { ...input, isUidModified: true }
    })
  },
  followingUser: async ({ target, status, user }) => {
    if (stringCompare(target, user.id)) {
      throw new UserInputError("操作錯誤，無法追蹤")
    }

    const currentTarget = await dataProvider.user.getById(target)
    const targetFollowers =
      status === USER_FOLLOW_STATUS_FOLLOW
        ? [
            ...currentTarget.followers.filter(
              item => !stringCompare(item, user.id)
            ),
            user.id
          ]
        : [
            ...currentTarget.followers.filter(
              item => !stringCompare(item, user.id)
            )
          ]

    await dataProvider.user.update({
      id: target,
      user,
      input: {
        followers: targetFollowers
      }
    })

    const currentUserFollowingIsExist = !!user.following.find(item =>
      stringCompare(item.target, target)
    )

    const currentUser = await dataProvider.user.update({
      id: user.id,
      user,
      input: {
        following: [
          ...(currentUserFollowingIsExist
            ? [
                ...user.following.map(item =>
                  stringCompare(item.target, target)
                    ? {
                        id: item.id,
                        target,
                        status,
                        unfollowAt:
                          status === USER_FOLLOW_STATUS_UNFOLLOW
                            ? Date.now()
                            : undefined
                      }
                    : item
                )
              ]
            : [
                ...user.following,
                {
                  target,
                  status,
                  unfollowAt:
                    status === USER_FOLLOW_STATUS_UNFOLLOW
                      ? Date.now()
                      : undefined
                }
              ])
        ]
      }
    })

    if (status === USER_FOLLOW_STATUS_FOLLOW && !currentUserFollowingIsExist) {
      // 建立聊天室
      await helpers.chatroom.artistChatroom({
        artist: target,
        user
      })

      const vouchers = helpers.voucher.createNewVouchers({
        source: VOUCHER_SOURCE_FOLLOWING,
        type: VOUCHER_TYPE_UNLOCK_CHAT,
        status: VOUCHER_STATUS_ACTIVED,
        artist: target,
        owner: currentUser.id,
        creator: currentUser.id,
        quantity: Number(
          (await redisClient.get(REDIS_FOLLOWING_REWARD_OF_UNLOCK_CHAT)) ||
            FOLLOWING_REWARD_OF_UNLOCK_CHAT
        )
      })
      await helpers.voucher.insertMany(vouchers)
    }

    return currentUser
  },
  subscribingUser: async ({ target, status, user }) => {
    if (stringCompare(target, user.id)) {
      throw new UserInputError("操作錯誤，無法訂閱")
    }

    if (
      user.coin <
      Number(
        (await redisClient.get(REDIS_SUBSCRIBEING_COIN)) || SUBSCRIBEING_COIN
      )
    ) {
      throw new Error("您的寶石不足，無法訂閱")
    }
    const currentTarget = await dataProvider.user.getById(target)
    const targetSubscribers =
      status === USER_SUBSCRIBE_STATUS_SUBSCRIBE
        ? [
            ...currentTarget.subscribers.filter(
              item => !stringCompare(item, user.id)
            ),
            user.id
          ]
        : [
            ...currentTarget.subscribers.filter(
              item => !stringCompare(item, user.id)
            )
          ]

    await dataProvider.user.update({
      id: target,
      user,
      input: {
        subscribers: targetSubscribers
      }
    })

    const currentUserSubscribingIsExist =
      user.subscribing.filter(item => stringCompare(item.target, target))
        .length === 1

    const currentUser = await dataProvider.user.update({
      id: user.id,
      user,
      input: {
        subscribing: [
          ...(currentUserSubscribingIsExist
            ? [
                ...user.subscribing.map(item =>
                  stringCompare(item.target, target)
                    ? {
                        id: item.id,
                        target,
                        status,
                        subscribeAt:
                          status === USER_SUBSCRIBE_STATUS_SUBSCRIBE
                            ? Date.now()
                            : undefined,
                        unsubscribeAt:
                          status === USER_SUBSCRIBE_STATUS_UNSUBSCRIBE
                            ? Date.now()
                            : undefined
                      }
                    : item
                )
              ]
            : [
                ...user.subscribing,
                {
                  target,
                  status,
                  subscribeAt:
                    status === USER_SUBSCRIBE_STATUS_SUBSCRIBE
                      ? Date.now()
                      : undefined,
                  unsubscribeAt:
                    status === USER_SUBSCRIBE_STATUS_UNSUBSCRIBE
                      ? Date.now()
                      : undefined
                }
              ])
        ]
      }
    })
    if (status === USER_SUBSCRIBE_STATUS_SUBSCRIBE) {
      await helpers.subscribe.createSubscriptionArtist({
        user: currentUser,
        subscribing: {
          target
        }
      })
    }
    return currentUser
  },
  blockingUser: async ({ target, status, user }) => {
    if (stringCompare(target, user.id)) {
      throw new UserInputError("操作錯誤，無法封鎖")
    }

    const currentTarget = await dataProvider.user.getById(target)
    const targetBlockers =
      status === USER_BLOCK_STATUS_BLOCK
        ? [
            ...currentTarget.blockers.filter(
              item => !stringCompare(item, user.id)
            ),
            user.id
          ]
        : [
            ...currentTarget.blockers.filter(
              item => !stringCompare(item, user.id)
            )
          ]

    await dataProvider.user.update({
      id: target,
      user,
      input: {
        blockers: targetBlockers
      }
    })

    const currentUserBlockingIsExist =
      user.blocking.filter(item => stringCompare(item.target, target))
        .length === 1

    return dataProvider.user.update({
      id: user.id,
      user,
      input: {
        blocking: [
          ...(currentUserBlockingIsExist
            ? [
                ...user.blocking.map(item =>
                  stringCompare(item.target, target)
                    ? {
                        id: item.id,
                        target,
                        status,
                        blockAt:
                          status === USER_BLOCK_STATUS_UNBLOCK
                            ? Date.now()
                            : undefined
                      }
                    : item
                )
              ]
            : [
                ...user.blocking,
                {
                  target,
                  status,
                  blockAt:
                    status === USER_BLOCK_STATUS_UNBLOCK
                      ? Date.now()
                      : undefined
                }
              ])
        ]
      }
    })
  },
  async isUidValueExist(uid) {
    const isExistUser = await dataProvider.user.getOne({ uid })
    return isExistUser !== null
  },
  async isPromotionCodeExist(promotionCode) {
    const isExistUser = await dataProvider.user.getOne({ promotionCode })
    return isExistUser !== null
  },
  async generateUniqueUid() {
    let result = ""
    for (let i = 0; i < 6; i += 1) {
      result += CHARACTER.charAt(Math.floor(Math.random() * CHARACTER_LENGTH))
    }

    if (await this.isUidValueExist(result)) {
      return this.generateUniqueUid()
    }
    return result
  },
  async generateUniquePromotionCode() {
    let result = ""
    for (let i = 0; i < 6; i += 1) {
      result += CHARACTER.charAt(Math.floor(Math.random() * CHARACTER_LENGTH))
    }

    if (await this.isPromotionCodeExist(result)) {
      return this.generateUniquePromotionCode()
    }

    return result
  },
  async upsertFacebookUser(profile) {
    const user = await dataProvider.user.getOne({
      email: profile.emails[0].value,
      scope: USER_SCOPE_FRONT
    })

    if (!user) {
      return dataProvider.user.create({
        input: {
          uid: await this.generateUniqueUid(),
          name:
            profile.displayName || `${profile.familyName} ${profile.givenName}`,
          email: profile.emails[0].value,
          recipientEmail: profile.emails[0].value,
          source: USER_SOURCE_FACEBOOK,
          scope: USER_SCOPE_FRONT,
          roleFeature: await helpers.roleFeature.getRoleClientId(),
          promotionCode: await this.generateUniquePromotionCode(),
          coin: 5200000,
          facebookId: profile.id,
          isEnabled: true,
          isPasswordNeedToChange: false
        }
      })
    }
    return dataProvider.user.update({
      id: user.id,
      input: {
        facebookId: profile.id
      }
    })
  },
  async upsertGoogleUser(profile) {
    const user = await dataProvider.user.getOne({
      email: profile.email,
      scope: USER_SCOPE_FRONT
    })

    if (!user) {
      return dataProvider.user.create({
        input: {
          uid: await this.generateUniqueUid(),
          name: profile.name,
          email: profile.email,
          recipientEmail: profile.email,
          scope: USER_SCOPE_FRONT,
          source: USER_SOURCE_GOOGLE,
          roleFeature: await helpers.roleFeature.getRoleClientId(),
          promotionCode: await this.generateUniquePromotionCode(),
          coin: 5200000,
          googleId: profile.sub,
          isEnabled: true,
          isPasswordNeedToChange: false
        }
      })
    }
    return dataProvider.user.update({
      id: user.id,
      input: {
        googleId: profile.sub
      }
    })
  }
}
