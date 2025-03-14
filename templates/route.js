export async function generateAuthRoutes(answers, projectPath, ext) {
  const authRoutes = `
import express from "express";
import { register, login } from "../controllers/auth.controller.${ext}";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
`;

  await fs.writeFile(path.join(projectPath, `src/routes/auth.routes.${ext}`), authRoutes);
}
