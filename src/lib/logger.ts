import { Logtail } from "@logtail/node"
import winston from "winston"
import { env } from "$env/dynamic/private"
import { LogtailTransport } from "@logtail/winston"


export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { host: process.env.HOST },
  handleExceptions: true,
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    silly: 5
  },
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      level: 'silly'
    }),
  ]
})

if (env.LOG_TOKEN) {
  const logtail = new Logtail(env.LOG_TOKEN)
  logger.add(new LogtailTransport(logtail));
} else {
  logger.warn("Missing logtail token, running without uploading logs...")
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize({
        colors: {
          error: 'bold red',
          warn: 'bold yellow',
          info: 'bold blue',
          http: 'bold green',
          debug: 'bold gray',
          silly: 'bold pink'
        }
      }),
      winston.format.align(),
      winston.format.cli(),
    )
  }))
}