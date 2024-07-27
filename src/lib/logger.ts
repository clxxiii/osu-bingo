import winston from "winston"

export const logger = winston.createLogger({
  level: 'info',
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
    debug: 3
  },
  transports: [
    new winston.transports.File({
      filename: 'app.log'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize({
        colors: {
          error: 'bold red',
          warn: 'bold yellow',
          info: 'bold blue',
          debug: 'bold gray'
        }
      }),
      winston.format.align(),
      winston.format.simple(),
    )
  }))
}