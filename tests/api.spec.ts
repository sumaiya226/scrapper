import request from "supertest";
import "dotenv/config";
import { Server } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { z } from "zod";

// Minimal inline app for tests (avoids DB)
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const Aadhaar = z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits");
const OTP = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");
const PAN = z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format");

const Step1Schema = z.object({
  aadhaar_number: Aadhaar,
  otp: OTP,
  consent: z.boolean()
});

const Step2Schema = z.object({
  pan: PAN
});

app.post("/api/v1/validate-step1", (req, res) => {
  const parsed = Step1Schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });
  if (parsed.data.otp !== (process.env.BYPASS_OTP || "123456")) return res.status(400).json({ ok: false });
  res.json({ ok: true });
});

app.post("/api/v1/validate-step2", (req, res) => {
  const parsed = Step2Schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false });
  res.json({ ok: true });
});

let server: Server;

beforeAll((done) => {
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

test("rejects invalid PAN", async () => {
  const res = await request(server).post("/api/v1/validate-step2").send({ pan: "abc" });
  expect(res.status).toBe(400);
});

test("accepts valid PAN", async () => {
  const res = await request(server).post("/api/v1/validate-step2").send({ pan: "ABCDE1234F" });
  expect(res.status).toBe(200);
});

test("rejects invalid Aadhaar/OTP", async () => {
  const res = await request(server).post("/api/v1/validate-step1").send({ aadhaar_number: "123", otp: "000000", consent: true });
  expect(res.status).toBe(400);
});

test("accepts valid Aadhaar/OTP", async () => {
  process.env.BYPASS_OTP = "000000";
  const res = await request(server).post("/api/v1/validate-step1").send({ aadhaar_number: "123456789012", otp: "000000", consent: true });
  expect(res.status).toBe(200);
});
