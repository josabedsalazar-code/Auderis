import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const clientSchema = z.object({
  name: z.string().min(2),
  taxId: z.string().optional(),
  contact: z.string().optional()
});

router.get("/clients", requireAuth, async (_req, res, next) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

router.post("/clients", requireAuth, async (req, res, next) => {
  try {
    const data = clientSchema.parse(req.body);
    const client = await prisma.client.create({ data });
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
});

router.get("/clients/:id", requireAuth, async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.json(client);
  } catch (error) {
    return next(error);
  }
});

export default router;