import AWS from "."
import fs from "fs"

const cf = new AWS.CloudFront.Signer(
  "APKAIM4T2QYPUTK4KOOA",
  fs.readFileSync("pk-APKAIM4T2QYPUTK4KOOA.pem").toString("ascii")
)

const policy = endPoint =>
  JSON.stringify({
    Statement: [
      {
        Resource: endPoint,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.round(new Date().getTime() / 1000) + 3600
          }
        }
      }
    ]
  })

const multiPolicy = endPoints => {
  const result = JSON.stringify({
    Statement: [
      ...endPoints.map(endPoint => ({
        Resource: endPoint,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": Math.round(new Date().getTime() / 1000) + 3600
          }
        }
      }))
    ]
  })
  console.log(result)
  return result
}

const getSignedCookie = endPoint => {
  const cookie = cf.getSignedCookie({ policy: policy(endPoint) })
  return cookie
}

const getMultiSignedCookie = endPoints => {
  const cookie = cf.getSignedCookie({ policy: multiPolicy(endPoints) })
  return cookie
}

const getMultiResource = (endPoints, res) => {
  const cookie = getMultiSignedCookie(endPoints)
  console.log(cookie)

  const options = {
    domain: ".appbanana.life",
    path: "/",
    httpOnly: true
  }

  res.cookie(
    "CloudFront-Key-Pair-Id",
    cookie["CloudFront-Key-Pair-Id"],
    options
  )
  res.cookie("CloudFront-Policy", cookie["CloudFront-Policy"], options)
  res.cookie("CloudFront-Signature", cookie["CloudFront-Signature"], options)
}

const getResource = (endPoint, res) => {
  const cookie = getSignedCookie(endPoint)
  const options = {
    domain: ".appbanana.life",
    path: "/",
    httpOnly: true
  }

  res.cookie(
    "CloudFront-Key-Pair-Id",
    cookie["CloudFront-Key-Pair-Id"],
    options
  )
  res.cookie("CloudFront-Policy", cookie["CloudFront-Policy"], options)
  res.cookie("CloudFront-Signature", cookie["CloudFront-Signature"], options)
}

export default { getResource, getMultiResource }
