#!/usr/bin/env node
import { program } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { initProject } from "./generator.js";

/**
 * Display a stylized banner using figlet and chalk.
 * The banner text is "TYPE-3" rendered in a 3D-ASCII font.
 */
const banner = figlet.textSync("TYPE-3", {
  font: "3D-ASCII",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true,
});

console.log(chalk.cyan(banner));

/**
 * Configure the CLI application using Commander.js.
 * This sets up the CLI's version, description, and commands.
 */
program
  .version("0.1.0-beta") // Set the CLI version.
  .description("type-3 CLI - Scaffold your backend projects effortlessly");

  console.log(chalk.green("Scaffold your backend projects effortlessly! 🚀"));
/**
 * Define the `init` command for the CLI.
 * This command initializes a new backend project by invoking the `initProject` function.
 */
program
  .command("init") // Define the `init` command.
  .description("Initialize a new backend project") // Add a description for the command.
  .action(async () => {
    // Display a welcome message when the `init` command is executed.
    console.log(chalk.blue("\n🚀 Welcome to Type-3 Project Generator!\n"));
    await initProject(); // Call the `initProject` function to scaffold the project.
  });

/**
 * Parse the command-line arguments provided by the user.
 * This triggers the execution of the appropriate command based on the input.
 */
program.parse(process.argv);