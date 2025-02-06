const { createLogger, Winston } = require("@artcom/logger")
const WinstonDailyRotateFile = require("winston-daily-rotate-file")
const config = require("./config.js")

const logger = createLoggerWithDir(config.logDir)

function createLoggerWithDir(logDir) {
  const transports = [
    new Winston.transports.Console({ level: "info" }),
    new WinstonDailyRotateFile({
      dirname: logDir,
      filename: `microphone-controller-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxSize: "100M",
      maxFiles: "7d",
    }),
  ]

  return createLogger({ transports })
}

module.exports = logger
