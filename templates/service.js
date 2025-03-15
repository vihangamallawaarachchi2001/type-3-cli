import fs from "fs-extra";
import path from "path";

/**
 * Generates service layer implementation based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateService(answers, projectPath, ext) {
  let serviceContent;

  // Handle no database scenario
  if (answers.database === 'None') {
    serviceContent = answers.language === 'TypeScript'
      ? `
export class HelloService {
  static getMessage(name?: string): string {
    return \`Hello, \${name || "world"}!\`;
  }
}
      `.trim()
      : `
class HelloService {
  static getMessage(name) {
    return \`Hello, \${name || "world"}!\`;
  }
}

module.exports = HelloService;
      `.trim();
  } 
  // Database-specific implementations
  else {
    serviceContent = answers.language === 'TypeScript'
      ? generateTypeScriptService(answers)
      : generateJavaScriptService(answers);
  }

  // Create services directory and write file
  await fs.ensureDir(path.join(projectPath, 'src/services'));
  await fs.writeFile(
    path.join(projectPath, `src/services/user.service.${ext}`),
    serviceContent
  );
}

/**
 * Generates TypeScript service implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted TypeScript service code
 */
function generateTypeScriptService(answers) {
  const dbType = answers.database;
  const authImports = answers.includeAuth ? 
    `import bcrypt from 'bcryptjs';\nimport jwt from 'jsonwebtoken';` : '';
  
  return `
import User from '../models/User';
${authImports}

export interface UserServiceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class UserService {
  ${answers.includeAuth ? `
  static async register(username: string, email: string, password: string): Promise<UserServiceResponse> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async login(email: string, password: string): Promise<UserServiceResponse> {
    try {
      ${dbType === 'MongoDB' 
        ? 'const user = await User.findOne({ email });' 
        : 'const user = await User.findOne({ where: { email } });'}
      
      if (!user) return { success: false, error: 'Invalid credentials' };
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return { success: false, error: 'Invalid credentials' };
      
      const token = jwt.sign(
        { id: user${dbType === 'MongoDB' ? '._id' : '.id'} }, 
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      
      return { success: true, data: { user, token } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  ` : ''}

  static async getAllUsers(): Promise<UserServiceResponse> {
    try {
      const users = await ${dbType === 'MongoDB' ? 'User.find()' : 'User.findAll()'};
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getUserById(id: string): Promise<UserServiceResponse> {
    try {
      const user = await ${dbType === 'MongoDB' 
        ? 'User.findById(id)' 
        : 'User.findByPk(id)'};
      return user 
        ? { success: true, data: user } 
        : { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateUser(id: string, data: any): Promise<UserServiceResponse> {
    try {
      ${dbType === 'MongoDB' 
        ? 'const user = await User.findByIdAndUpdate(id, data, { new: true });' 
        : 'const [affectedCount] = await User.update(data, { where: { id } });\n' +
          '      const user = affectedCount > 0 ? await User.findByPk(id) : null;'}
      return user 
        ? { success: true, data: user } 
        : { success: false, error: 'Update failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteUser(id: string): Promise<UserServiceResponse> {
    try {
      ${dbType === 'MongoDB' 
        ? 'await User.findByIdAndDelete(id);' 
        : 'await User.destroy({ where: { id } });'}
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
  `.trim();
}

/**
 * Generates JavaScript service implementation
 * @param {Object} answers - User configuration
 * @returns {string} Formatted JavaScript service code
 */
function generateJavaScriptService(answers) {
  const dbType = answers.database;
  const authImports = answers.includeAuth ? 
    `const bcrypt = require('bcryptjs');\nconst jwt = require('jsonwebtoken');` : '';
  
  return `
const User = require('../models/User');
${authImports}

class UserService {
  ${answers.includeAuth ? `
  static async register(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async login(email, password) {
    try {
      ${dbType === 'MongoDB' 
        ? 'const user = await User.findOne({ email });' 
        : 'const user = await User.findOne({ where: { email } });'}
      
      if (!user) return { success: false, error: 'Invalid credentials' };
      
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return { success: false, error: 'Invalid credentials' };
      
      const token = jwt.sign(
        { id: user${dbType === 'MongoDB' ? '._id' : '.id'} }, 
         
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return { success: true, data: { user, token } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  ` : ''}

  static async getAllUsers() {
    try {
      const users = await ${dbType === 'MongoDB' ? 'User.find()' : 'User.findAll()'};
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getUserById(id) {
    try {
      const user = await ${dbType === 'MongoDB' 
        ? 'User.findById(id)' 
        : 'User.findByPk(id)'};
      return user 
        ? { success: true, data: user } 
        : { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateUser(id, data) {
    try {
      ${dbType === 'MongoDB' 
        ? 'const user = await User.findByIdAndUpdate(id, data, { new: true });' 
        : 'const [affectedCount] = await User.update(data, { where: { id } });\n' +
          '      const user = affectedCount > 0 ? await User.findByPk(id) : null;'}
      return user 
        ? { success: true, data: user } 
        : { success: false, error: 'Update failed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteUser(id) {
    try {
      ${dbType === 'MongoDB' 
        ? 'await User.findByIdAndDelete(id);' 
        : 'await User.destroy({ where: { id } });'}
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = UserService;
  `.trim();
}