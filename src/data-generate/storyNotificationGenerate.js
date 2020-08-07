import helpers from "../helpers"

export default async users => {
  await users.forEach(async item => {
    try {
      const story = (
        await helpers.story.getByFilter({ creator: item.id }).sort({
          updatedAt: "asc"
        })
      )[0]
      await helpers.storyNotification.create({
        input: {
          latestStory: (await story) ? (await story).id : null,
          readUserList: [],
          creator: item.id
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  })
}
