import fs from "fs-extra";
import path from "path";

/**
 * Generates README.md file based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 */
export async function generateReadme(answers, projectPath) {
  const {
    projectName,
    language,
    packageManager,
    database,
    includeAuth,
    includeLog
  } = answers;

  const readmeContent = `
# ${projectName}

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## Description
${projectName} is a modern backend API built with:
- **Express.js** ${language === 'TypeScript' ? 'and TypeScript' : ''}
- ${database === 'None' ? 'No database' : `**${database}** database integration`}
- ${includeAuth ? 'JWT Authentication' : 'No authentication'}
- ${includeLog ? 'Winston/Morgan logging' : 'Basic error handling'}

## Features
${generateFeatureList(answers)}

## Getting Started

### Prerequisites
- Node.js 18+
- ${database !== 'None' ? `${database} server` : ''}
- ${packageManager} package manager

### Installation
\`\`\`bash
# Navigate to project directory
cd ${projectName}

# Install dependencies
${packageManager} install (already installed on setup)
\`\`\`

### Configuration
Create a \`.env\` file with:
\`\`\`env
PORT=3000
NODE_ENV=development
${database !== 'None' ? `DB_URL=${getDatabaseUrlExample(database)}` : ''}
${includeAuth ? 'JWT_SECRET=your-secret-key' : ''}
\`\`\`

## Usage
\`\`\`bash
# Start development server
${packageManager} run dev

# Production build ${language === 'TypeScript' ? '(TypeScript projects)' : ''}
${packageManager} build
\`\`\`

${includeAuth ? '## Authentication\n' +
'```bash\n' +
'# Register new user\n' +
'curl -X POST -H "Content-Type: application/json" \\\n' +
'-d \'{ "username": "user", "email": "user@example.com", "password": "pass123" }\' \\\n' +
'http://localhost:3000/api/register\n\n' +

'# Login\n' +
'curl -X POST -H "Content-Type: application/json" \\\n' +
'-d \'{ "email": "user@example.com", "password": "pass123" }\' \\\n' +
'http://localhost:3000/api/login\n' +
'```\n' : ''}

## API Documentation
\`\`\`
GET /health - Health check
${database !== 'None' ? 
'GET /api/users - Get all users (protected)\n' +
'GET /api/users/:id - Get user by ID\n' +
'PUT /api/users/:id - Update user\n' +
'DELETE /api/users/:id - Delete user' : ''}
\`\`\`

## Project Structure
\`\`\`
src/
├── config/        # Database configuration
├── controllers/   # Request handlers
├── middleware/    # Authentication middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Logger utilities
└── server.${language === 'TypeScript' ? 'ts' : 'js'}  # Entry point
\`\`\`

## Technologies
- Express.js
${language === 'TypeScript' ? '- TypeScript\n' : ''}
${database !== 'None' ? `- ${database === 'MongoDB' ? 'Mongoose' : 'Sequelize'}\n` : ''}
- Winston/Morgan logging
- Helmet security
- CORS
- Cookie-parser
- Dotenv

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
  `.trim();

  await fs.writeFile(
    path.join(projectPath, 'README.md'),
    readmeContent
  );
}

function generateFeatureList(answers) {
  const features = [
    'RESTful API endpoints',
    answers.database !== 'None' && 'Database integration',
    answers.includeAuth && 'JWT Authentication',
    answers.includeLog && 'Structured logging',
    'Environment variables',
    'Security headers (Helmet)',
    'CORS handling',
    'Cookie parsing',
    'Error handling middleware'
  ].filter(Boolean);

  return features.map(feat => `- ${feat}`).join('\n');
}

function getDatabaseUrlExample(database) {
  switch(database) {
    case 'MongoDB':
      return 'mongodb://localhost:27017/mydb';
    case 'MySQL':
      return 'mysql://user:pass@localhost:3306/mydb';
    case 'PostgreSQL':
      return 'postgres://user:pass@localhost:5432/mydb';
    default:
      return '';
  }
}