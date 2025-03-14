import fs from "fs-extra";
import path from "path";

export async function generateService(answers, projectPath, ext) {
  const service = answers.language === "TypeScript"
    ? `
    export const getHelloMessage = (): string => "Hello, world!";
    `
    : `
    exports.getHelloMessage = () => "Hello, world!";
    `;

  await fs.writeFile(path.join(projectPath, `src/services/helloWorld.service.${ext}`), service);
}