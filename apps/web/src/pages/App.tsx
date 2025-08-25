import React, { useMemo, useState } from "react";
import schema from "../lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step1Schema, Step2Schema } from "../lib/validation";
import DynamicField from "../components/DynamicField";
import Stepper from "../components/Stepper";
import { validateStep1, validateStep2, submitAll } from "../lib/api";

type Field = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

export default function App() {
  const [step, setStep] = useState(1);
  const step1Fields: Field[] = useMemo(() => schema.steps[0].fields as any, []);
  const step2Fields: Field[] = useMemo(() => schema.steps[1].fields as any, []);

  const step1Form = useForm({
    resolver: zodResolver(Step1Schema),
    defaultValues: { consent: false }
  });
  const step2Form = useForm({
    resolver: zodResolver(Step2Schema)
  });

  const onSubmitStep1 = step1Form.handleSubmit(async (data) => {
    const res = await validateStep1(data);
    if (res.ok) setStep(2);
    else step1Form.setError("otp", { message: "Invalid OTP (use demo BYPASS_OTP)" });
  });

  const onSubmitStep2 = step2Form.handleSubmit(async (data) => {
    const res = await validateStep2(data);
    if (!res.ok) return;
    // Submit both steps
    const payload = { step1: step1Form.getValues(), step2: data };
    const final = await submitAll(payload);
    if (final.ok) {
      alert("Submitted! Check API logs / DB.");
      step1Form.reset();
      step2Form.reset();
      setStep(1);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-2">Udyam — Steps 1 & 2 (Demo)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Mobile-first, dynamic form + live validation.
        </p>
        <Stepper step={step} />

        {step === 1 && (
          <form onSubmit={onSubmitStep1} className="flex flex-col gap-4">
            {step1Fields.map((f) => (
              <DynamicField key={f.id} field={f as any} register={step1Form.register} errors={step1Form.formState.errors} />
            ))}
            <button
              type="submit"
              className="mt-2 rounded-xl px-4 py-2 bg-black text-white font-medium"
            >
              Verify & Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={onSubmitStep2} className="flex flex-col gap-4">
            {step2Fields.map((f) => (
              <DynamicField key={f.id} field={f as any} register={step2Form.register} errors={step2Form.formState.errors} />
            ))}
            <div className="flex items-center justify-between mt-2 text-black">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl px-4 py-2 border">
                Back
              </button>
              <button type="submit" className="rounded-xl px-4 py-2 bg-black text-white font-medium">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
