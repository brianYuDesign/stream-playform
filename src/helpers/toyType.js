import dataProvider from "../data-provider"

export default {
  ...dataProvider.toyType,
  toyTypes: ({ isEnabled }) =>
    isEnabled
      ? dataProvider.toyType.getByFilter({ isEnabled })
      : dataProvider.toyType.getAll()
}
