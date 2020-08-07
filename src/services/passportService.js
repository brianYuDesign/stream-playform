import passport from "passport"
import FacebookTokenStrategy from "passport-facebook-token"
// import { Strategy as GoogleTokenStrategy } from "passport-google-token"
import GoogleTokenStrategy from "passport-google-id-token"
import env from "dotenv"

env.config()

const {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID
  // GOOGLE_CLIENT_SECRET
} = process.env

// FACEBOOK STRATEGY
const FacebookTokenStrategyCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) =>
  done(null, {
    accessToken,
    refreshToken,
    profile
  })

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET
    },
    FacebookTokenStrategyCallback
  )
)

// GOOGLE STRATEGY
const GoogleTokenStrategyCallback = (parsedToken, googleId, done) =>
  done(null, {
    parsedToken,
    googleId,
    done
  })

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: GOOGLE_CLIENT_ID
    },
    GoogleTokenStrategyCallback
  )
)

// promisified authenticate functions
const authenticateFacebook = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "facebook-token",
      { session: false },
      (err, data, info) => {
        if (err) reject(err)
        resolve({ data, info })
      }
    )(req, res)
  })

const authenticateGoogle = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      "google-id-token",
      { session: false },
      (err, data, info) => {
        if (err) reject(err)
        resolve({ data, info })
      }
    )(req, res)
  })

export default { authenticateFacebook, authenticateGoogle }
