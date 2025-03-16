import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";


import { generatePackageJson } from "./packageJson.js";
import { generateServer } from "./server.js"; 
import { generateDotenv } from "./env.js"; 
import { generateGitignore } from "./gitignore.js";
import { generateReadme } from "./readme.js";
import { generateDbConfig } from "./dbConfig.js";
import { generateAuthMiddleware } from "./authUtils.js";
import { generateController } from "./controller.js";
import { generateRouter } from "./route.js"; 
import { generateService } from "./service.js";
import { generateUtils } from "./logger.js"; 
import { generateUserModel } from "./model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function generateTemplates(answers, projectPath) {
  const ext = answers.language === "TypeScript" ? "ts" : "js";

  const dirs = [
    "src/config",
    "src/controllers",
    "src/middleware",
    "src/models",
    "src/routes",
    "src/services",
    "src/utils",
    "logs"
  ];

  if (answers.language === "TypeScript") {
    dirs.push("src/types");
  }

  try {
    await Promise.all(
      dirs.map(dir => 
        fs.ensureDir(path.join(projectPath, dir))
      )
    );
  } catch (error) {
    console.error(`Error creating directories: ${error.message}`);
    process.exit(1);
  }

  // Core file generation
  try {
    await generatePackageJson(answers, projectPath);
    await generateDotenv(answers, projectPath); 
    await generateGitignore(answers, projectPath);
    await generateReadme(answers, projectPath);
    await generateDbConfig(answers, projectPath, ext);
    await generateServer(answers, projectPath, ext);
    
    // Language-specific files
    if (answers.language === "TypeScript") {
      await generateTsConfig(projectPath);
    }

    // Logging utilities
    if (answers.includeLog) {
      await generateUtils(answers, projectPath, ext); 
    }

    // Authentication components
    if (answers.includeAuth) {
      await generateAuthMiddleware(answers, projectPath, ext);
    }

    // MVC components
    await generateUserModel(answers, projectPath, ext);
    await generateService(answers, projectPath, ext);
    await generateController(answers, projectPath, ext);
    await generateRouter(answers, projectPath, ext); 

    // Fallback for no database
    if (answers.database === "None") {
      await generateHelloWorldFiles(answers, projectPath, ext);
    }
  } catch (error) {
    console.error(`Error generating files: ${error.message}`);
    process.exit(1);
  }
}

async function generateHelloWorldFiles(answers, projectPath, ext) {
  try {
    // Controller
    const controllerPath = path.join(projectPath, `src/controllers/hello.controller.${ext}`);
    const controllerContent = answers.language === "TypeScript"
      ? `export const sayHello = (req: any, res: any) => res.json({ message: "Hello, world!" });`
      : `exports.sayHello = (req, res) => res.json({ message: "Hello, world!" });`;
    
    await fs.writeFile(controllerPath, controllerContent);

    // Route
    const routePath = path.join(projectPath, `src/routes/hello.routes.${ext}`);
    const routeContent = answers.language === "TypeScript"
      ? `import express from 'express';\nimport { sayHello } from '../controllers/hello.controller';\n\nconst router = express.Router();\nrouter.get('/', sayHello);\nexport default router;`
      : `const express = require('express');\nconst { sayHello } = require('../controllers/hello.controller');\n\nconst router = express.Router();\nrouter.get('/', sayHello);\nmodule.exports = router;`;

    await fs.writeFile(routePath, routeContent);
  } catch (error) {
    console.error(`Error generating hello world files: ${error.message}`);
    process.exit(1);
  }
}

async function generateTsConfig(projectPath) {
  try {
    const tsConfigPath = path.join(projectPath, "tsconfig.json");
    const tsConfig = {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        strict: true,
        moduleResolution: "node",
        resolveJsonModule: true,
        outDir: "./dist",
        rootDir: "./src",
        esModuleInterop: true,
        skipLibCheck: true,
        incremental: true,
        sourceMap: true
      },
      include: ["src/**/*"],
      exclude: ["node_modules"]
    };

    await fs.writeJSON(tsConfigPath, tsConfig, { spaces: 2 });
  } catch (error) {
    console.error(`Error generating tsconfig.json: ${error.message}`);
    process.exit(1);
  }
}