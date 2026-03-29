import bcrypt from "bcryptjs";
import { prisma } from "../db/prismaClient.js";
import express from "express";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();
const SALT = Number(process.env.SALTING);

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const password_hash = await bcrypt.hash(password, SALT);

  try {
    const user = await prisma.user.create({
      data: { username, password_hash },
    });

    return res.status(201).json(user);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Username already exists!",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials!" });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);

  if (isValid) {
    const token = generateToken(user);
    return res.status(200).json({ token: token });
  }
});

export default router;
