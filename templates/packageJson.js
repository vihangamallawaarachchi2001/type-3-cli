import fs from 'fs-extra'
import path from 'path'

export async function generatePackageJson(answers, projectPath) {
  const packageJson = {
    name: answers.projectName,
    version: "1.0.0",
    description: "🚀 Generated by create-type-3 CLI 🛠️",
    main: answers.language === "TypeScript" ? "dist/server.js" : "src/server.js",
    scripts: {
      start: answers.language === "TypeScript" ? "node dist/server.js" : "node src/server.js",
      dev: answers.language === "TypeScript" ? "nodemon src/server.ts" : "nodemon src/server.js",
      lint: "eslint . --fix",
      build: answers.language === "TypeScript" ? "tsc" : "echo 'No build step needed for JavaScript projects'",
      prestart: answers.language === "TypeScript" ? "npm run build" : undefined, 
    },
    dependencies: {},
    devDependencies: {},
  };

  if (!packageJson.scripts.prestart) {
    delete packageJson.scripts.prestart;
  }

  await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2));
}