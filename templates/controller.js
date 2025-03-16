import fs from "fs-extra";
import path from "path";

/**
 * Generates controller layer implementation based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateController(answers, projectPath, ext) {
  let controllerContent;

  // Handle no database scenario
  if (answers.database === 'None') {
    controllerContent = answers.language === 'TypeScript'
      ? `
import { Request, Response } from 'express';
import { getMessage } from '../services/user.service';

export const getMessage = (req: Request, res: Response) => {
  const name = req.query.name as string;
  const message = getMessage(name);
  res.status(200).json({ message });
};
      `.trim()
      : `
const { getMessage } = require('../services/user.service');

const getMessage = (req, res) => {
  const name = req.query.name;
  const message = getMessage(name);
  res.status(200).json({ message });
};

module.exports = { getMessage };
      `.trim();
  } 
  // Database-specific implementations
  else {
    controllerContent = answers.language === 'TypeScript'
      ? generateTypeScriptController(answers)
      : generateJavaScriptController(answers);
  }

  // Create controllers directory and write file
  await fs.ensureDir(path.join(projectPath, 'src/controllers'));
  await fs.writeFile(
    path.join(projectPath, `src/controllers/user.controller.${ext}`),
    controllerContent
  );
}

/**
 * Generates TypeScript controller implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted TypeScript controller code
 */
function generateTypeScriptController(answers) {
  const authRoutes = answers.includeAuth ? `
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const result = await UserService.register(username, email, password);
  result.success 
    ? res.status(201).json(result.data)
    : res.status(400).json({ error: result.error });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await UserService.login(email, password);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(401).json({ error: result.error });
};
` : '';

  return `
import { Request, Response } from 'express';
import { 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  ${answers.includeAuth ? 'register, login,' : ''}
} from '../services/user.service';

${authRoutes}

export const getAllUsersController = async (req: Request, res: Response) => {
  const result = await getAllUsers();
  result.success 
    ? res.status(200).json(result.data)
    : res.status(500).json({ error: result.error });
};

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getUserById(id);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(404).json({ error: result.error });
};

export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateUser(id, data);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(400).json({ error: result.error });
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUser(id);
  result.success 
    ? res.status(204).send()
    : res.status(500).json({ error: result.error });
};
  `.trim();
}

/**
 * Generates JavaScript controller implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted JavaScript controller code
 */
function generateJavaScriptController(answers) {
  const authRoutes = answers.includeAuth ? `
const register = async (req, res) => {
  const { username, email, password } = req.body;
  const result = await UserService.register(username, email, password);
  result.success 
    ? res.status(201).json(result.data)
    : res.status(400).json({ error: result.error });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await UserService.login(email, password);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(401).json({ error: result.error });
};
` : '';

  return `
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  ${answers.includeAuth ? 'register, login,' : ''}
} = require('../services/user.service');

${authRoutes}

const getAllUsersController = async (req, res) => {
  const result = await getAllUsers();
  result.success 
    ? res.status(200).json(result.data)
    : res.status(500).json({ error: result.error });
};

const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getUserById(id);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(404).json({ error: result.error });
};

const updateUserController = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateUser(id, data);
  result.success 
    ? res.status(200).json(result.data)
    : res.status(400).json({ error: result.error });
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  const result = await deleteUser(id);
  result.success 
    ? res.status(204).send()
    : res.status(500).json({ error: result.error });
};

module.exports = {
  ${answers.includeAuth ? 'register, login,' : ''}
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
};
  `.trim();
}