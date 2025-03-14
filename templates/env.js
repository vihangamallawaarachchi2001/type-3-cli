import fs from "fs-extra";
import path from "path";

export async function generateEnvFile(answers, projectPath) {
  const dbConfig = {
    mongodb: `mongodb://localhost:27017/${answers.projectName}`,
    mysql: "mysql://user:password@localhost:3306/dbname",
    postgresql: "postgresql://user:password@localhost:5432/dbname",
    none: "",
  };

  const envContent = `PORT=3000
APP_NAME=${answers.projectName}
NODE_ENV=development
DB_URL=${dbConfig[answers.database.toLowerCase()] || ""}
JWT_SECRET=your_jwt_secret`;

  await fs.writeFile(path.join(projectPath, ".env"), envContent);
  console.log("✅ .env file created successfully!");
}