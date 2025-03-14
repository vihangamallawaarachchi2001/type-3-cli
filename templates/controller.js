export async function generateAuthController(answers, projectPath, ext) {
  const authController = answers.language === "TypeScript"
    ? `
import User from "../models/User";
import { Request, Response } from "express";
import { generateToken, hashPassword, comparePassword } from "../utils/auth.utils";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
`
    : `
const User = require("../models/User");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth.utils");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ user, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login };
`;

  await fs.writeFile(path.join(projectPath, `src/controllers/auth.controller.${ext}`), authController);
}
