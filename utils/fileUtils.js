import fs from "fs-extra";
import path from "path";

/**
 * Checks if a file or directory exists.
 * @param {string} filePath - The path to check.
 * @returns {boolean} - Whether the file/directory exists.
 */
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to ensure.
 */
export async function ensureDirectory(dirPath) {
  await fs.ensureDir(dirPath);
}

/**
 * Writes content to a file.
 * @param {string} filePath - The file path to write to.
 * @param {string} content - The content to write.
 */
export async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content);
}