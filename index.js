#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { initProject } from "./generator.js";

const banner = figlet.textSync("TYPE-3", {
  font: "3D-ASCII",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
});

console.log(chalk.cyan(banner));
console.log(chalk.green("Scaffold your backend projects effortlessly! 🚀"));

program
  .version("1.0.0")
  .description("type-3 CLI - Scaffold your backend projects effortlessly");

program
  .command("init")
  .description("Initialize a new backend project")
  .action(async () => {
    console.log(chalk.blue("\n🚀 Welcome to Type-3 Project Generator!\n"));
    await initProject();
  });

program.parse(process.argv);