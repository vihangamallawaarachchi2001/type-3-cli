import fs from "fs-extra";
import path from "path";
import { generatePackageJson } from "./packageJson.js";
import { generateServerFile } from "./server.js";
import { generateEnvFile } from "./env.js";
import { generateGitignore } from "./gitignore.js";
import { generateReadme } from "./readme.js";
import { generateDbConfig } from "./dbConfig.js";
import { generateAuthUtils } from "./authUtils.js";
import { generateController } from "./controller.js";
import { generateRoute } from "./route.js";
import { generateService } from "./service.js";

export async function generateTemplates(answers, projectPath) {
  const ext = answers.language === "TypeScript" ? "ts" : "js";

  // Create essential directories
  const dirs = [
    "src/routes",
    "src/controllers",
    "src/middlewares",
    "src/services",
    "src/utils",
    "src/models",
    "src/config",
    "logs",
    "tests",
  ];
  if (answers.language === "TypeScript") dirs.push("src/types");

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }

  // Generate files
  await generatePackageJson(answers, projectPath);
  await generateServerFile(answers, projectPath, ext);
  await generateEnvFile(answers, projectPath);
  await generateGitignore(projectPath);
  await generateReadme(answers, projectPath);
  await generateDbConfig(answers, projectPath, ext);

  // Add additional files based on user preferences
  if (answers.includeAuth) {
    await generateAuthFiles(answers, projectPath, ext);
  } else {
    await generateHelloWorldFiles(answers, projectPath, ext);
  }

  if (answers.language === "TypeScript") {
    await generateTsConfig(projectPath);
  }
}

async function generateAuthFiles(answers, projectPath, ext) {
  await generateAuthUtils(answers, projectPath, ext);
  await generateController(answers, projectPath, ext);
  await generateRoute(answers, projectPath, ext);
  await generateService(answers, projectPath, ext);
}

async function generateHelloWorldFiles(answers, projectPath, ext) {
  const helloController = `
    export const sayHello = (req, res) => res.json({ message: "Hello, world!" });
  `;
  await fs.writeFile(path.join(projectPath, "src/controllers/helloWorld.controller.js"), helloController);

  const helloRoutes = `
    import express from 'express';
    import { sayHello } from '../controllers/helloWorld.controller';

    const router = express.Router();
    router.get('/', sayHello);
    export default router;
  `;
  await fs.writeFile(path.join(projectPath, "src/routes/helloWorld.routes.js"), helloRoutes);
}

async function generateTsConfig(projectPath) {
  const tsConfig = {
    compilerOptions: {
      target: "ES6",
      module: "ESNext",
      strict: true,
      moduleResolution: "node",
      resolveJsonModule: true,
      outDir: "./dist",
      rootDir: "./src",
      esModuleInterop: true,
      skipLibCheck: true,
    },
    include: ["src/**/*"],
  };
  await fs.writeFile(path.join(projectPath, "tsconfig.json"), JSON.stringify(tsConfig, null, 2));
}