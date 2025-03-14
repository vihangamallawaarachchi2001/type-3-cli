import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { generateTemplates } from "./templates/index.js";

export async function initProject() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-express-project",
    },
    {
      type: "list",
      name: "language",
      message: "Which programming language will you use?",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager do you prefer?",
      choices: ["npm", "yarn", "pnpm"],
    },
    {
      type: "list",
      name: "database",
      message: "Which database will you use?",
      choices: ["MongoDB", "MySQL", "PostgreSQL", "None"],
      default: "None",
    },
    {
      type: "confirm",
      name: "includeAuth",
      message: "Include JWT authentication?",
      default: false,
    },
    {
      type: "confirm",
      name: "includeLog",
      message: "Include Winston and Morgan Logging?",
      default: true,
    },
  ]);

  const projectPath = path.join(process.cwd(), answers.projectName);
  await fs.ensureDir(projectPath);

  console.log(chalk.yellow(`\n📝 Creating project folder: ${answers.projectName}...`));
  await generateTemplates(answers, projectPath);

  console.log(chalk.green("\n✅ Project successfully created!"));
  console.log(chalk.cyan("\n📁 Navigate into your project:"));
  console.log(chalk.magenta(`   cd ${answers.projectName}`));
  console.log(chalk.cyan("\n📦 Install dependencies:"));
  console.log(chalk.magenta(`   ${answers.packageManager} install`));
  console.log(chalk.cyan("\n▶️ Start the project:"));
  console.log(chalk.magenta(`   ${answers.packageManager} start`));

  // Combine all dependencies into a single array
  const baseDependencies = [
    "express",
    "dotenv",
    "cors",
    "cookie-parser",
    "helmet",
  ];

  const devDependencies = [
    "nodemon",
    "eslint",
    ...(answers.language === "TypeScript"
      ? ["typescript", "ts-node", "@types/node", "@types/express"]
      : []),
  ];

  const dbDependencies = {
    MongoDB: ["mongoose"],
    MySQL: ["mysql2", "sequelize"],
    PostgreSQL: ["pg", "pg-hstore", "sequelize"],
    None: [],
  };

  const featureDependencies = [];
  if (answers.includeAuth) featureDependencies.push("jsonwebtoken", "bcryptjs");
  if (answers.includeLog) featureDependencies.push("winston", "morgan");

  // Combine all dependencies
  const allDependencies = [
    ...baseDependencies,
    ...dbDependencies[answers.database],
    ...featureDependencies,
  ];

  // Combine all devDependencies
  const allDevDependencies = [...devDependencies];

  // Install all dependencies in one command
  console.log(chalk.yellow("\n📦 Installing dependencies..."));
  try {
    const installCommand = `${answers.packageManager} install ${allDependencies.join(" ")} ${allDevDependencies.map(dep => `-D ${dep}`).join(" ")}`;
    execSync(installCommand, {
      stdio: "inherit",
      cwd: projectPath,
    });
    console.log(chalk.green("\n🎉 Dependencies installed successfully!"));
  } catch (error) {
    console.error(chalk.red("\n❌ Error installing dependencies. Please run the install command manually."));
  }
}