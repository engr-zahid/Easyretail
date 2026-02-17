const { createLogger, format, transports } = require('winston');

const env = process.env.NODE_ENV || 'development';
const level = process.env.LOG_LEVEL || (env === 'development' ? 'debug' : 'info');

const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    env === 'development'
      ? format.combine(format.colorize(), format.simple())
      : format.json()
  ),
  transports: [new transports.Console({ stderrLevels: ['error'] })]
});

module.exports = logger;
