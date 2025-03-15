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
import { HelloService } from '../services/user.service';

export class HelloController {
  static getMessage(req: Request, res: Response) {
    const name = req.query.name as string;
    const message = HelloService.getMessage(name);
    res.status(200).json({ message });
  }
}
      `.trim()
      : `
const HelloService = require('../services/user.service');

class HelloController {
  static getMessage(req, res) {
    const name = req.query.name;
    const message = HelloService.getMessage(name);
    res.status(200).json({ message });
  }
}

module.exports = HelloController;
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
  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const result = await UserService.register(username, email, password);
    result.success 
      ? res.status(201).json(result.data)
      : res.status(400).json({ error: result.error });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(401).json({ error: result.error });
  }
  ` : '';

  return `
import { Request, Response } from 'express';
import { UserService, UserServiceResponse } from '../services/user.service';

export class UserController {
  ${authRoutes}

  static async getAllUsers(req: Request, res: Response) {
    const result: UserServiceResponse = await UserService.getAllUsers();
    result.success 
      ? res.status(200).json(result.data)
      : res.status(500).json({ error: result.error });
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const result: UserServiceResponse = await UserService.getUserById(id);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(404).json({ error: result.error });
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const result: UserServiceResponse = await UserService.updateUser(id, data);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(400).json({ error: result.error });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const result: UserServiceResponse = await UserService.deleteUser(id);
    result.success 
      ? res.status(204).send()
      : res.status(500).json({ error: result.error });
  }
}
  `.trim();
}

/**
 * Generates JavaScript controller implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted JavaScript controller code
 */
function generateJavaScriptController(answers) {
  const authRoutes = answers.includeAuth ? `
  static async register(req, res) {
    const { username, email, password } = req.body;
    const result = await UserService.register(username, email, password);
    result.success 
      ? res.status(201).json(result.data)
      : res.status(400).json({ error: result.error });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(401).json({ error: result.error });
  }
  ` : '';

  return `
const UserService = require('../services/user.service');

class UserController {
  ${authRoutes}

  static async getAllUsers(req, res) {
    const result = await UserService.getAllUsers();
    result.success 
      ? res.status(200).json(result.data)
      : res.status(500).json({ error: result.error });
  }

  static async getUserById(req, res) {
    const { id } = req.params;
    const result = await UserService.getUserById(id);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(404).json({ error: result.error });
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const data = req.body;
    const result = await UserService.updateUser(id, data);
    result.success 
      ? res.status(200).json(result.data)
      : res.status(400).json({ error: result.error });
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);
    result.success 
      ? res.status(204).send()
      : res.status(500).json({ error: result.error });
  }
}

module.exports = UserController;
  `.trim();
}