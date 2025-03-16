import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { generateTemplates } from "./templates/index.js";

/**
 * Initializes a new backend project by prompting the user for configuration options,
 * generating project files, and installing dependencies.
 *
 * The function uses `inquirer` to gather user input, `fs-extra` to create the project directory,
 * and `generateTemplates` to scaffold the project structure. It also installs necessary
 * dependencies based on the user's choices.
 */
export async function initProject() {
  
  const handleInterrupt = () => {
    console.log(chalk.red("\n❌ Process interrupted. Cleaning up..."));
    process.exit(1);
  };

  process.on("SIGINT", handleInterrupt);

  try {
    /**
     * Prompts the user for project configuration details using `inquirer`.
     * @type {Object} answers - User responses to prompts.
     * @property {string} projectName - The name of the project.
     * @property {string} language - The programming language (JavaScript or TypeScript).
     * @property {string} packageManager - The preferred package manager (npm, yarn, or pnpm).
     * @property {string} database - The database choice (MongoDB, MySQL, PostgreSQL, or None).
     * @property {boolean} includeAuth - Whether to include JWT authentication.
     * @property {boolean} includeLog - Whether to include Winston and Morgan logging.
     */
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

    /**
     * Creates the project directory in the current working directory.
     * @type {string} projectPath - Absolute path to the project directory.
     */
    const projectPath = path.join(process.cwd(), answers.projectName);
    await fs.ensureDir(projectPath);

    console.log(chalk.yellow(`\n📝 Creating project folder: ${answers.projectName}...`));
    
    /**
     * Generates project files and templates based on user input.
     * @function generateTemplates
     * @param {Object} answers - User responses to prompts.
     * @param {string} projectPath - Path to the project directory.
     */
    await generateTemplates(answers, projectPath);

    console.log(chalk.green("\n✅ Project successfully created!"));
    console.log(chalk.cyan("\n📁 Navigate into your project:"));
    console.log(chalk.magenta(`   cd ${answers.projectName}`));
    console.log(chalk.cyan("\n▶️ Start the project:"));
    console.log(chalk.magenta(`   ${answers.packageManager} run dev`));

    /**
     * Defines the base dependencies required for the project.
     * @type {string[]} baseDependencies - Common dependencies for all projects.
     */
    const baseDependencies = [
      "express",
      "dotenv",
      "cors",
      "cookie-parser",
      "helmet",
    ];

    /**
     * Defines development dependencies based on the selected language.
     * @type {string[]} devDependencies - Development tools and libraries.
     */
    const devDependencies = [
      "nodemon",
      "eslint",
      ...(answers.language === "TypeScript"
        ? ["typescript", "ts-node", "@types/node", "@types/express"]
        : []),
    ];

    /**
     * Maps database choices to their respective dependencies.
     * @type {Object} dbDependencies - Database-specific dependencies.
     */
    const dbDependencies = {
      MongoDB: ["mongoose"],
      MySQL: ["mysql2", "sequelize"],
      PostgreSQL: ["pg", "pg-hstore", "sequelize"],
      None: [],
    };

    /**
     * Defines feature-specific dependencies based on user choices.
     * @type {string[]} featureDependencies - Optional dependencies for JWT auth and logging.
     */
    const featureDependencies = [];
    if (answers.includeAuth) featureDependencies.push("jsonwebtoken", "bcryptjs");
    if (answers.includeLog) featureDependencies.push("winston", "morgan");

    /**
     * Combines all dependencies into a single array for installation.
     * @type {string[]} allDependencies - All runtime dependencies for the project.
     */
    const allDependencies = [
      ...baseDependencies,
      ...dbDependencies[answers.database],
      ...featureDependencies,
    ];

    /**
     * Combines all development dependencies into a single array for installation.
     * @type {string[]} allDevDependencies - All development dependencies for the project.
     */
    const allDevDependencies = [...devDependencies];

    // Install all dependencies in one command
    console.log(chalk.yellow("\n📦 Installing dependencies..."));
    try {
      /**
       * Constructs and executes the dependency installation command.
       * @type {string} installCommand - Command to install dependencies using the chosen package manager.
       */
      const installCommand = `${answers.packageManager} install ${allDependencies.join(" ")} ${allDevDependencies.map(dep => `-D ${dep}`).join(" ")}`;
      execSync(installCommand, {
        stdio: "inherit",
        cwd: projectPath,
      });
      console.log(chalk.green("\n🎉 Dependencies installed successfully!"));
    } catch (error) {
      console.error(chalk.red("\n❌ Error installing dependencies. Please run the install command manually."));
    }
  } catch (error) {
    console.error(chalk.red("\n❌ An unexpected error occurred during the project initialization. Please try again."));
  } finally {
    process.removeListener("SIGINT", handleInterrupt);
  }
}
