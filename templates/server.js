import fs from "fs-extra";
import path from "path";

export async function generateServerFile(answers, projectPath, ext) {
  const serverContent = answers.language === "TypeScript"
    ? `
    import express from "express";
    import dotenv from "dotenv";
    import helmet from "helmet";
    import cors from "cors";

    dotenv.config();
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    app.get("/", (req, res) => {
      res.send("🚀 Welcome to your Type-3 generated backend!");
    });

    app.listen(PORT, () => {
      console.log(\`✅ Server is running on http://localhost:\${PORT}\`);
    });
    `
    : `
    const express = require("express");
    const dotenv = require("dotenv");
    const helmet = require("helmet");
    const cors = require("cors");

    dotenv.config();
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    app.get("/", (req, res) => {
      res.send("🚀 Welcome to your Type-3 generated backend!");
    });

    app.listen(PORT, () => {
      console.log(\`✅ Server is running on http://localhost:\${PORT}\`);
    });
    `;

  await fs.writeFile(path.join(projectPath, `src/server.${ext}`), serverContent);
}