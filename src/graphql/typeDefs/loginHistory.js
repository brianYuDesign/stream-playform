import { gql } from "apollo-server-express"

export default gql`
  type LoginHistory {
    createdAt: DateTime!
    creator: User!
  }

  extend type Query {
    "取得登入紀錄"
    loginHistories: [LoginHistory]
    "取得單一登入紀錄"
    loginHistory(id: ID): LoginHistory
  }
`
