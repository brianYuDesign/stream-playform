import { LANG_TW, LANG_JP } from "../constants"
import helpers from "../helpers"

export default async tmpAdminUser => {
  await helpers.coin.create({
    input: {
      quantity: 24999,
      price: 49,
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 49999,
      price: 99,
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 99999,
      price: 199,
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 159999,
      price: 299,
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 269999,
      price: 499,
      lang: LANG_TW
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 24999,
      price: 490,
      lang: LANG_JP
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 49999,
      price: 990,
      lang: LANG_JP
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 99999,
      price: 1990,
      lang: LANG_JP
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 159999,
      price: 2990,
      lang: LANG_JP
    },
    user: tmpAdminUser
  })
  await helpers.coin.create({
    input: {
      quantity: 269999,
      price: 4990,
      lang: LANG_JP
    },
    user: tmpAdminUser
  })
}
