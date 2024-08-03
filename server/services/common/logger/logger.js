'use strict';
const winston = require('winston');
const colors = require('colors');
colors.enabled = true;

/**
 * specifies the regular log message format
 * @type {Format} winston log message format
 */
const logMessageFormat = winston.format.printf((
    {level, message, timestamp} ) => {
  return `[${timestamp}][${level}]${message}`;
});

/**
 * specifies the log message format for a succes message
 * @type {Format} winston log message format
 */
const successLogMessageFormat = winston.format.printf((
    {level, message, timestamp} ) => {
  return `[${timestamp}][Success]${message}`;
});

/**
 * specifies the log leves and log colors for the various log types
 * @type {{levels: {warn: number, http: number, error: number, info: number},
 * colors: {warn: string, http: string, error: string, info: string}}}
 */
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    http: 'green',
  },
};
winston.addColors(logLevels);

/**
 * specifies general log format
 * @type {Format} winston log format
 */
const logFormat = winston.format.combine(
    winston.format.timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),
    logMessageFormat,
    winston.format.colorize({all: true})
);

/**
 * specifies the log format for successful logs
 * @type {Format} winston log format
 */
const successLogFormat = winston.format.combine(
    winston.format.timestamp({format: 'DD/MM/YYYY HH:mm:ss'}),
    successLogMessageFormat,
    winston.format.colorize({all: true})
);

/**
 * info level logs logger
 * @type {winston.Logger} winston logger
 */
const infoLevelLogger = winston.createLogger({
  level: 'info',
  json: false,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

/**
 * warning level logs logger
 * @type {winston.Logger} winston logger
 */
const warningLevelLogger = winston.createLogger({
  level: 'warn',
  json: false,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

/**
 * error level log logger
 * @type {winston.Logger} winston logger
 */
const errorLevelLogger = winston.createLogger({
  level: 'error',
  json: false,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

/**
 * success level log logger, here http level is used as a substitute for the
 * success log level as winston does not have that level
 * @type {winston.Logger} winston logger
 */
const successLevelLogger = winston.createLogger({
  level: 'http',
  json: false,
  format: successLogFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

/**
 * class that encapsulates logger functionality
 */
class Logger {
  /**
   * verifies if logging is enabled
   * @return {boolean} whether or not logging is enabled
   */
  static isLoggingEnable() {
    return process.env.LOGGING_ENABLE === 'true';
  }
  /**
   * logs an info level log
   * @param {string} message message to be logged
   * @param {string} module module the log comes from
   */
  static infoLog(message, module) {
    if (!this.isLoggingEnable()) return;
    infoLevelLogger.info('@'+module+':'+message);
  }
  /**
   * logs an error level log
   * @param {string} message message to be logged
   * @param {string} module module the log comes from
   */
  static errorLog(message, module) {
    if (!this.isLoggingEnable()) return;
    errorLevelLogger.error('@'+module+':'+message);
  }
  /**
   * logs an warning level log
   * @param {string} message message to be logged
   * @param {string} module module the log comes from
   */
  static warnLog(message, module) {
    if (!this.isLoggingEnable()) return;
    warningLevelLogger.warn('@'+module+':'+message);
  }
  /**
   * logs an success level log
   * @param {string} message message to be logged
   * @param {string} module module the log comes from
   */
  static successLog(message, module) {
    if (!this.isLoggingEnable()) return;
    // http is used as a success substitute as winston does not provide a
    // success method
    successLevelLogger.http('@'+module+':'+message);
  }
}

module.exports = {Logger};
