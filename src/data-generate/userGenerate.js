import helpers from "../helpers"
import { getRandomObject } from "../utils"

const createArtists = async length => {
  const roleArtistId = await helpers.roleFeature.getRoleArtistId()
  const dealers = await helpers.dealer.getAll()
  const artists = []
  for (let i = 0; i < length; i += 1) {
    artists.push({
      uid: `artist${i}`,
      name: `artist${i}`,
      email: `artist${i}@gmail.com`,
      avatar: `users/test/${i}.avatar.jpg`,
      background: `users/test/${i}.avatar.jpg`,
      coin: 5000,
      roleFeature: roleArtistId,
      dealer: getRandomObject(dealers).id,
      isDateabled: true,
      promotionCode: `artist${i}promotionCode`
    })
  }
  return artists
}

const createClients = async length => {
  const roleClientId = await helpers.roleFeature.getRoleClientId()
  const clients = []
  for (let i = 0; i < length; i += 1) {
    clients.push({
      uid: `client${i}`,
      name: `client${i}`,
      email: `client${i}@gmail.com`,
      coin: 5000,
      roleFeature: roleClientId,
      isDateabled: true,
      promotionCode: `client${i}promotionCode`
    })
  }
  return clients
}

export default async () => {
  const artists = await createArtists(20)
  const clients = await createClients(100)
  await helpers.user.insertMany(artists)
  await helpers.user.insertMany(clients)
}
