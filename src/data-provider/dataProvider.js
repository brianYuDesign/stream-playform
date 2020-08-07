import NodeCache from "node-cache"

const memoryCache = new NodeCache()

export default model => ({
  getAll: () => {
    try {
      return model.find().lean()
    } catch (error) {
      throw new Error(error)
    }
  },
  getById: async id => {
    try {
      return model.findById(id).lean()
    } catch (error) {
      throw new Error(error)
    }
  },
  getByIds: async ids => {
    try {
      return model.find({ _id: { $in: ids } })
    } catch (error) {
      throw new Error(error)
    }
  },
  getByFilter: filter => {
    try {
      return model.find(filter).lean()
    } catch (error) {
      throw new Error(error)
    }
  },
  getOne: async filter => {
    try {
      return model.findOne(filter).lean()
    } catch (error) {
      throw new Error(error)
    }
  },
  create: ({ input, user }) => {
    try {
      const data = {
        creator: user !== undefined ? user.id : undefined,
        ...input
      }

      if (model.joiValidate) {
        const e = model.validate(data)
        if (e) throw new Error(e)
      }
      return model.create(data)
    } catch (error) {
      throw new Error(error)
    }
  },
  update: async ({ id, input, user = undefined }) => {
    try {
      const result = await model.findByIdAndUpdate(
        id,
        {
          updater: user !== undefined ? user.id : undefined,
          ...input
        },
        { new: true }
      )

      memoryCache.set(JSON.stringify(id), result)
      return result
    } catch (error) {
      throw new Error(error)
    }
  },
  insertMany: arrayObj => {
    try {
      return model.insertMany(arrayObj)
    } catch (error) {
      throw new Error(error)
    }
  },
  updateMany: ({ filter, input, user, unset }) => {
    try {
      return model.updateMany(filter, {
        $set: { updater: user !== undefined ? user.id : undefined, ...input },
        $unset: { ...unset }
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  upsertMany: async ({ input, unset, user }) => {
    try {
      input.forEach(async item => {
        await model.findByIdAndUpdate(
          item.id,
          {
            $set: {
              updater: user !== undefined ? user.id : undefined,
              ...item
            },
            $unset: { ...unset }
          },
          { new: true }
        )
      })

      return model.find()
    } catch (error) {
      throw new Error(error)
    }
  },
  delete: async id => {
    try {
      await model.deleteOne({ _id: id })
      return id
    } catch (error) {
      throw new Error(error)
    }
  },
  populate: async ({ model, field }) => {
    try {
      return (await model.populate(field).execPopulate())[field]
    } catch (error) {
      throw new Error(error)
    }
  },
  paginate: async (filter, { pageSize = 10, pageNumber, sort }) => {
    try {
      return model.paginate(filter, {
        page: pageNumber + 1,
        limit: pageSize,
        sort,
        lean: true,
        leanWithId: true
      })
    } catch (error) {
      throw new Error(error)
    }
  }
})
