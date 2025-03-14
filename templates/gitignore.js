import fs from "fs-extra";
import path from "path";

export async function generateGitignore(projectPath) {
  const gitignoreContent = `
node_modules
dist
.env
logs
`;

  await fs.writeFile(path.join(projectPath, ".gitignore"), gitignoreContent);
  console.log("✅ .gitignore file created successfully!");
}