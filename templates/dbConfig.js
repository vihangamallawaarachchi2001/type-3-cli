import fs from "fs-extra";
import path from "path";

export async function generateDbConfig(answers, projectPath, ext) {
  const dbConfig = answers.language === "TypeScript"
    ? `
    import mongoose from "mongoose";
    import { Sequelize } from "sequelize";

    const db = {};

    if (process.env.DB_URL.startsWith("mongodb")) {
      mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db.connection = mongoose.connection;
    } else {
      const sequelize = new Sequelize(process.env.DB_URL, {
        dialect: process.env.DB_URL.includes("mysql") ? "mysql" : "postgres",
      });
      db.connection = sequelize;
    }

    export default db;
    `
    : `
    const mongoose = require("mongoose");
    const { Sequelize } = require("sequelize");

    const db = {};

    if (process.env.DB_URL.startsWith("mongodb")) {
      mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db.connection = mongoose.connection;
    } else {
      const sequelize = new Sequelize(process.env.DB_URL, {
        dialect: process.env.DB_URL.includes("mysql") ? "mysql" : "postgres",
      });
      db.connection = sequelize;
    }

    module.exports = db;
    `;

  await fs.writeFile(path.join(projectPath, `src/config/dbConfig.${ext}`), dbConfig);
}