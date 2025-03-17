import fs from "fs-extra";
import path from "path";

export async function generateDbConfig(answers, projectPath, ext) {
  let configContent;

  if (answers.database === "None") {
    // No database configuration
    configContent =
      answers.language === "TypeScript"
        ? `// No database configuration\nconst db = {};\n\nexport default db;`
        : `// No database configuration\nconst db = {};\n\nmodule.exports = db;`;
  }
  else if (answers.database === "MongoDB") {
    // MongoDB configuration
    configContent =
      answers.language === "TypeScript"
        ? `
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not defined");
    }
    
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

export default dbConnection;
`.trim()
        : `
const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not defined");
    }
    
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

module.exports = dbConnection;
`.trim();
  }
  else {
    // SQL configuration (MySQL/PostgreSQL)
    const dialect = answers.database.toLowerCase();
    configContent =
      answers.language === "TypeScript"
        ? `
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error("Database URL is missing in environment variables.");
  process.exit(1); 
}

const sequelize = new Sequelize(dbUrl, {
  dialect: ${answers.database === 'MySQL' ? `'mysql'` : `'postgres'`}, 
  logging: false, 
});

const dbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

export { sequelize, dbConnection };
`.trim()
        : `
const { Sequelize } = require("sequelize");
require('dotenv').config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  console.error("Database URL is missing in environment variables.");
  process.exit(1); 
}

const sequelize = new Sequelize(process.env.DB_URL || "", {
  dialect: ${answers.database === 'MySQL' ? `'mysql'` : `'postgres'`}, 
  logging: false,
});


const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established");
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, dbConnection };
`.trim();
  }

  // Write configuration file
  await fs.ensureDir(path.join(projectPath, "src/config"));
  await fs.writeFile(
    path.join(projectPath, `src/config/dbConfig.${ext}`),
    configContent
  );
}