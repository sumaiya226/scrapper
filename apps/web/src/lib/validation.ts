import { z } from "zod";

export const Aadhaar = z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits");
export const OTP = z.string().regex(/^\d{6}$/, "OTP must be 6 digits");
export const PAN = z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format");

export const Step1Schema = z.object({
  aadhaar_number: Aadhaar,
  otp: OTP,
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) })
});

export const Step2Schema = z.object({
  pan: PAN
});
