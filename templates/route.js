import fs from "fs-extra";
import path from "path";

/**
 * Generates Express router configuration based on project settings
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateRouter(answers, projectPath, ext) {
  let routerContent;

  // Handle no database scenario
  if (answers.database === 'None') {
    routerContent = answers.language === 'TypeScript'
      ? `
import express from 'express';
import { HelloController } from '../controllers/user.controller';

const router = express.Router();

router.get('/hello', HelloController.getMessage);

export default router;
      `.trim()
      : `
const express = require('express');
const HelloController = require('../controllers/user.controller');

const router = express.Router();

router.get('/hello', HelloController.getMessage);

module.exports = router;
      `.trim();
  } 
  // Database-specific implementations
  else {
    routerContent = answers.language === 'TypeScript'
      ? generateTypeScriptRouter(answers)
      : generateJavaScriptRouter(answers);
  }

  // Create routes directory and write file
  await fs.ensureDir(path.join(projectPath, 'src/routes'));
  await fs.writeFile(
    path.join(projectPath, `src/routes/user.routes.${ext}`),
    routerContent
  );
}

/**
 * Generates TypeScript router implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted TypeScript router code
 */
function generateTypeScriptRouter(answers) {
  const authMiddleware = answers.includeAuth ? 
    `import authMiddleware from '../middleware/auth.middleware';` : '';
  
  const authRoutes = answers.includeAuth ? `
  router.post('/register', UserController.register);
  router.post('/login', UserController.login);
  ` : '';

  return `
import express from 'express';
import { UserController } from '../controllers/user.controller';
${authMiddleware}

const router = express.Router();

${authRoutes}

router.get('/users', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.getAllUsers);
router.get('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.getUserById);
router.put('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.updateUser);
router.delete('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.deleteUser);

export default router;
  `.trim();
}

/**
 * Generates JavaScript router implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted JavaScript router code
 */
function generateJavaScriptRouter(answers) {
  const authMiddleware = answers.includeAuth ? 
    `const authMiddleware = require('../middleware/auth.middleware');` : '';
  
  const authRoutes = answers.includeAuth ? `
  router.post('/register', UserController.register);
  router.post('/login', UserController.login);
  ` : '';

  return `
const express = require('express');
const UserController = require('../controllers/user.controller');
${authMiddleware}

const router = express.Router();

${authRoutes}

router.get('/users', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.getAllUsers);
router.get('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.getUserById);
router.put('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.updateUser);
router.delete('/users/:id', ${answers.includeAuth ? 'authMiddleware,' : ''} UserController.deleteUser);

module.exports = router;
  `.trim();
}