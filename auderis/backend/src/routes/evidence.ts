import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

const evidenceSchema = z.object({
  auditId: z.string().uuid().optional(),
  findingId: z.string().uuid().optional(),
  filename: z.string().min(1),
  url: z.string().url()
}).refine((data) => data.auditId || data.findingId, {
  message: "auditId or findingId is required",
  path: ["auditId"]
});

router.post("/evidence", requireAuth, async (req, res, next) => {
  try {
    const data = evidenceSchema.parse(req.body);
    const evidence = await prisma.evidence.create({
      data: {
        auditId: data.auditId,
        findingId: data.findingId,
        filename: data.filename,
        url: data.url
      }
    });
    res.status(201).json(evidence);
  } catch (error) {
    next(error);
  }
});

export default router;