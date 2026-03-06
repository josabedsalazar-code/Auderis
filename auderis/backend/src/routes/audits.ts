import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import requireAuth from "../middleware/requireAuth.js";
import { AuditStatus, ChecklistStatus, FindingSeverity, FindingStatus } from "@prisma/client";

const router = Router();

const auditSchema = z.object({
  title: z.string().min(2),
  scope: z.string().optional(),
  status: z.nativeEnum(AuditStatus).optional(),
  clientId: z.string().uuid()
});

const checklistSchema = z.object({
  title: z.string().min(2),
  status: z.nativeEnum(ChecklistStatus).optional()
});

const findingSchema = z.object({
  title: z.string().min(2),
  severity: z.nativeEnum(FindingSeverity),
  status: z.nativeEnum(FindingStatus).optional(),
  description: z.string().optional()
});

router.get("/audits", requireAuth, async (_req, res, next) => {
  try {
    const audits = await prisma.audit.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true }
    });
    res.json(audits);
  } catch (error) {
    next(error);
  }
});

router.post("/audits", requireAuth, async (req, res, next) => {
  try {
    const data = auditSchema.parse(req.body);
    const audit = await prisma.audit.create({
      data: {
        title: data.title,
        scope: data.scope,
        status: data.status ?? AuditStatus.PLANNED,
        clientId: data.clientId
      }
    });
    res.status(201).json(audit);
  } catch (error) {
    next(error);
  }
});

router.get("/audits/:id", requireAuth, async (req, res, next) => {
  try {
    const audit = await prisma.audit.findUnique({
      where: { id: req.params.id },
      include: {
        client: true,
        checklists: true,
        findings: true,
        evidence: true
      }
    });
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }
    return res.json(audit);
  } catch (error) {
    return next(error);
  }
});

router.post("/audits/:id/checklists", requireAuth, async (req, res, next) => {
  try {
    const data = checklistSchema.parse(req.body);
    const audit = await prisma.audit.findUnique({ where: { id: req.params.id } });
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    const checklist = await prisma.checklist.create({
      data: {
        auditId: audit.id,
        title: data.title,
        status: data.status ?? ChecklistStatus.OPEN
      }
    });

    return res.status(201).json(checklist);
  } catch (error) {
    return next(error);
  }
});

router.post("/audits/:id/findings", requireAuth, async (req, res, next) => {
  try {
    const data = findingSchema.parse(req.body);
    const audit = await prisma.audit.findUnique({ where: { id: req.params.id } });
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    const finding = await prisma.finding.create({
      data: {
        auditId: audit.id,
        title: data.title,
        severity: data.severity,
        status: data.status ?? FindingStatus.OPEN,
        description: data.description
      }
    });

    return res.status(201).json(finding);
  } catch (error) {
    return next(error);
  }
});

export default router;