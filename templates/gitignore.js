import fs from "fs-extra";
import path from "path";

/**
 * Generates .gitignore file based on project configuration
 * @param {Object} answers - User configuration object
 * @param {string} projectPath - Project root directory path
 */
export async function generateGitignore(answers, projectPath) {
  const { language } = answers;
  const isTypeScript = language === 'TypeScript';

  const gitignoreContent = `# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log
pnpm-debug.log
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build artifacts
dist/
build/
*.tgz

# Environment variables
.env
.env*.local
!.env.example

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
.pnpm-debug.log*

# OS specific
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage/
test-results/

# Database
*.sqlite
*.db

# TypeScript
${isTypeScript ? '' : '# '}*.tsbuildinfo
${isTypeScript ? '' : '# '}dist/
`;

  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    gitignoreContent.trim()
  );
}