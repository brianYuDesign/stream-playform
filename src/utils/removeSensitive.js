export default users => {
  if (users === null) {
    return null
  }

  if (Array.isArray(users)) {
    return users.map(user => deleteSensitiveProperty(user))
  } else if (!Array.isArray(users) && typeof users === "object") {
    return deleteSensitiveProperty(users)
  } else {
    return null
  }
}

const deleteSensitiveProperty = user => {
  user.password = null
  user.email = null
  user.recipientEmail = null
  user.phoneNumber = null
  return user
}
