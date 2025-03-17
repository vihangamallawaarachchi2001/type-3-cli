import fs from "fs-extra";
import path from "path";

/**
 * Generates authentication middleware based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 * @param {string} ext - File extension (js/ts)
 */
export async function generateAuthMiddleware(answers, projectPath, ext) {
  if (!answers.includeAuth) return;

  const middlewarePath = path.join(projectPath, 'src/middleware');
  await fs.ensureDir(middlewarePath);

  const content = answers.language === 'TypeScript'
    ? `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export default function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
    `.trim()
    : `
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
    `.trim();

  await fs.writeFile(
    path.join(middlewarePath, `auth.middleware.${ext}`),
    content
  );
}