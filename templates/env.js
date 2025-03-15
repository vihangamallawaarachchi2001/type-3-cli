import fs from "fs-extra";
import path from "path";

/**
 * Generates .env file template based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 */
export async function generateDotenv(answers, projectPath) {
  const { database, includeAuth, includeLog } = answers;

  let envContent = `# Server configuration
PORT=3000
NODE_ENV=development

`;

  // Database configuration
  if (database !== 'None') {
    envContent += `# Database connection
DB_URL=${getDatabaseUrlExample(database)}
`;
  }

  // Authentication configuration
  if (includeAuth) {
    envContent += `
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
`;
  }

  // Logging configuration
  if (includeLog) {
    envContent += `
# Logging configuration
LOG_LEVEL=info
LOG_DIR=logs
`;
  }

  // Add warning comment
  envContent += `
# !! IMPORTANT !!
# 1. Add this file to .gitignore
# 2. Never commit sensitive information
# 3. Create .env.production for production environments`;

  await fs.writeFile(
    path.join(projectPath, '.env'),
    envContent.trim()
  );
}

function getDatabaseUrlExample(database) {
  switch(database) {
    case 'MongoDB':
      return 'mongodb://localhost:27017/mydatabase';
    case 'MySQL':
      return 'mysql://username:password@localhost:3306/mydatabase';
    case 'PostgreSQL':
      return 'postgres://username:password@localhost:5432/mydatabase';
    default:
      return '';
  }
}