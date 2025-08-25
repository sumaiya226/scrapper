import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const Aadhaar = z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits");
const OTP = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");
const PAN = z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format");

const Step1Schema = z.object({
  aadhaar_number: Aadhaar,
  otp: OTP,
  consent: z.boolean().refine(Boolean, "Consent is required")
});

const Step2Schema = z.object({
  pan: PAN
});

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Validate Step 1
app.post("/api/v1/validate-step1", async (req, res) => {
  const parsed = Step1Schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { otp } = parsed.data;
  const bypass = process.env.BYPASS_OTP || "123456";
  if (otp !== bypass) {
    return res.status(400).json({ errors: { form: "Invalid OTP (use demo BYPASS_OTP)" } });
  }
  return res.json({ ok: true });
});

// Validate Step 2
app.post("/api/v1/validate-step2", async (req, res) => {
  const parsed = Step2Schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  return res.json({ ok: true });
});

// Submit (store both steps)
app.post("/api/v1/submit", async (req, res) => {
  const step1 = Step1Schema.safeParse(req.body.step1);
  const step2 = Step2Schema.safeParse(req.body.step2);
  if (!step1.success || !step2.success) {
    return res.status(400).json({
      errors: {
        step1: step1.success ? null : step1.error.flatten(),
        step2: step2.success ? null : step2.error.flatten()
      }
    });
  }
  const created = await prisma.registration.create({
    data: {
      aadhaarNumber: step1.data.aadhaar_number,
      otp: step1.data.otp,
      pan: step2.data.pan
    }
  });
  return res.json({ ok: true, id: created.id });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
