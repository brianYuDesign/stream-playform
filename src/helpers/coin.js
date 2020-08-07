import dataProvider from "../data-provider"

export default {
  ...dataProvider.coin,
  frontCoins: ({ lang }) =>
    dataProvider.coin.getByFilter({ lang, isEnabled: true })
}
