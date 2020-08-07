import fs from "fs"
import _ from "lodash"
import { exec } from "child_process"


const dbOptions = {
  user: "",
  pass: "",
  host: "localhost",
  port: 27017,
  database: "GeTech",
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: "backup-data/" // i.e. /var/database-backup/
}
/* return date object */
const stringToDate = dateString => {
  return new Date(dateString)
}
/* return if variable is empty or not. */
const empty = mixedVar => {
  const emptyValues = [undefined, null, false, 0, "", "0"]
  if (emptyValues.includes(mixedVar)) {
    return true
  }

  return false
}

export default () => {
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup === true) {
    const date = new Date()
    let beforeDate
    let oldBackupDir = ""
    let oldBackupPath = ""

    const currentDate = stringToDate(date) // Current date
    const newBackupDir = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`

    // New backup path for current backup process
    const newBackupPath = `${dbOptions.autoBackupPath}mongodump-${newBackupDir} `

    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate)
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup)
      oldBackupDir = `${
        beforeDate.getFullYear()
        } -${beforeDate.getMonth() + 1} -${beforeDate.getDate()} `
      // old backup(after keeping # of days)
      oldBackupPath = `${dbOptions.autoBackupPath} mongodump - ${oldBackupDir} `
    }

    const cmd = `mongodump --host ${dbOptions.host} --port ${dbOptions.port} --db ${dbOptions.database} --out ${newBackupPath} ` // Command for mongodb dump process

    exec(cmd, (error) => {
      console.log(error)
      if (empty(error)) {
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup === true) {
          if (fs.existsSync(oldBackupPath)) {
            exec(`rm - rf ${oldBackupPath} `, (err) => console.log(err))
          }
        }
      }
    })
  }
}
