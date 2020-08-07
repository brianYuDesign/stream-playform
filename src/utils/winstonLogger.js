import appRoot from "app-root-path"
import winston from "winston"

const { combine, timestamp, printf } = winston.format
// define the custom settings for each transport (file, console)
const myFormat = printf(({ level, message, label = "", timestamp }) => {
  return `[ ${level} ] - ${timestamp} - [${label}] ${message}`
})

const options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: combine(timestamp(), myFormat)
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    format: combine(winston.format.colorize(), timestamp(), myFormat)
  }
}

// instantiate a new Winston Logger with the settings defined above
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.File({
      filename: `${appRoot}/logs/errors.log`,
      level: "error",
      format: combine(timestamp(), myFormat)
    })
  ],
  exitOnError: false // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
winstonLogger.stream = {
  // eslint-disable-next-line no-unused-vars
  write(message, encoding) {
    winstonLogger.info(message)
  }
}

export default winstonLogger
