import React from "react";

export default function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${step >= n ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
          >
            {n}
          </div>
          {n < 2 && <div className="w-12 h-1 rounded bg-gray-300" />}
        </div>
      ))}
    </div>
  );
}
