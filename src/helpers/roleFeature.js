import { ADMIN, MANAGER, DEALER, CLIENT, ARTIST } from "../constants"
import dataProvider from "../data-provider"

export default {
  ...dataProvider.roleFeature,
  getRoleAdminId: async () =>
    (await dataProvider.roleFeature.getOne({ name: ADMIN })).id,
  getRoleManagerId: async () =>
    (await dataProvider.roleFeature.getOne({ name: MANAGER })).id,
  getRoleDealerId: async () =>
    (await dataProvider.roleFeature.getOne({ name: DEALER })).id,
  getRoleClientId: async () =>
    (await dataProvider.roleFeature.getOne({ name: CLIENT })).id,
  getRoleArtistId: async () =>
    (await dataProvider.roleFeature.getOne({ name: ARTIST })).id
}
