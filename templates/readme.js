import fs from "fs-extra";
import path from "path";

export async function generateReadme(answers, projectPath) {
  const readmeContent = `# ${answers.projectName}

## Getting Started

\`\`\`
${answers.packageManager} install
${answers.packageManager} run dev
\`\`\`

## Features
- Express.js
- ${answers.language}
- ${answers.database === "None" ? "" : answers.database}
- ${answers.includeAuth ? "JWT Authentication" : ""}
- ${answers.includeLog ? "Winston and Morgan Logging" : ""}
`;

  await fs.writeFile(path.join(projectPath, "README.md"), readmeContent);
  console.log("✅ README.md file created successfully!");
}