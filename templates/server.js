import fs from "fs-extra";
import path from "path";

/**
 * Generates main server file with all integrations
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateServer(answers, projectPath, ext) {
  let serverContent;

  const hasAuth = answers.includeAuth;
  const hasLog = answers.includeLog;
  const dbType = answers.database;
  const language = answers.language;

  // Common imports
  const imports = language === 'TypeScript'
    ? `
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
${hasLog ? 'import logger from "./utils/logger";' : ''}
${dbType !== 'None' ? 
dbType === 'MongoDB' ? 'import dbConnection from "./config/dbConfig";' : 'import { dbConnection } from "./config/dbConfig";' : ''}
import userRoutes from './routes/user.routes';
${hasAuth ? 'import authMiddleware from "./middleware/auth.middleware";' : ''}
    `.trim()
    : `
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
${hasLog ? 'const logger = require("./utils/logger");' : ''}
${dbType !== 'None' ? dbType === 'MongoDB' ? 'const dbConnection = require("./config/dbConfig");' : 'const {dbConnection} = require("./config/dbConfig");' : ''}
const userRoutes = require('./routes/user.routes');
${hasAuth ? 'const authMiddleware = require("./middleware/auth.middleware");' : ''}
    `.trim();

  // Logging setup
  const loggingSetup = hasLog ? `
// Logging configuration
${language === 'TypeScript' 
  ? 'import morganMiddleware from "./utils/morganMiddleware";'
  : 'const morganMiddleware = require("./utils/morganMiddleware");'
}
app.use(morganMiddleware);
  ` : '';

  

  // Error handling middleware
  const errorHandling = language === 'TypeScript'
    ? `
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  ${hasLog ? 'logger' : 'console'}.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
    `.trim()
    : `
// Error handling middleware
app.use((err, req, res, next) => {
  ${hasLog ? 'logger' : 'console'}.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
    `.trim();

  // Main server content
  serverContent = language === 'TypeScript'
    ? `
${imports}

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

${loggingSetup}

//getting database connected
${dbType !== 'None' && `
(async () => {
  await dbConnection();  
})();`}

// Routes setup
app.use('/api', userRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

${errorHandling}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Server activation
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
    `.trim()
    : `
${imports}

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

${loggingSetup}

//getting database connected
${dbType !== 'None' && `
(async () => {
  await dbConnection();  
})();`}

// Routes setup
app.use('/api', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

${errorHandling}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Server activation
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
    `.trim();

  // Create server file
  await fs.writeFile(
    path.join(projectPath, `src/server.${ext}`),
    serverContent
  );
}
