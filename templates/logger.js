import fs from "fs-extra";
import path from "path";

/**
 * Generates logging utilities based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateUtils(answers, projectPath, ext) {
  if (!answers.includeLog) return;

  // Create utils directory
  const utilsPath = path.join(projectPath, 'src/utils');
  await fs.ensureDir(utilsPath);

  // Generate logger
  await generateLogger(answers, utilsPath, ext);
  
  // Generate Morgan middleware
  await generateMorganMiddleware(answers, utilsPath, ext);
}

async function generateLogger(answers, utilsPath, ext) {
  const content = answers.language === 'TypeScript'
    ? `
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return \`\${timestamp} [\${level}]: \${message}\`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

export default logger;
    `.trim()
    : `
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return \`\${timestamp} [\${level}]: \${message}\`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
    `.trim();

  await fs.writeFile(
    path.join(utilsPath, `logger.${ext}`),
    content
  );
}

async function generateMorganMiddleware(answers, utilsPath, ext) {
  const content = answers.language === 'TypeScript'
    ? `
import morgan from 'morgan';
import logger from './logger';

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
);

export default morganMiddleware;
    `.trim()
    : `
const morgan = require('morgan');
const logger = require('./logger');

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
);

module.exports = morganMiddleware;
    `.trim();

  await fs.writeFile(
    path.join(utilsPath, `morganMiddleware.${ext}`),
    content
  );
}