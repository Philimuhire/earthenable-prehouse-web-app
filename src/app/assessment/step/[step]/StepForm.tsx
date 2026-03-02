"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";
import { AssessmentStep, TOTAL_STEPS } from "@/lib/assessmentSteps";

interface StepFormProps {
  step: AssessmentStep;
  stepNumber: number;
}

export default function StepForm({ step, stepNumber }: StepFormProps) {
  const router = useRouter();
  const isLast = stepNumber === TOTAL_STEPS;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLast) {
      router.push("/assessment/complete");
    } else {
      router.push(`/assessment/step/${stepNumber + 1}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
      <ProgressBar current={stepNumber} total={TOTAL_STEPS} />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-brand-black">{step.title}</h2>
        <p className="text-brand-black/55 text-sm">{step.description}</p>
      </div>

      <div className="flex flex-col gap-5">
        {step.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-brand-black"
            >
              {field.label}
              {field.required && (
                <span className="ml-1 text-brand-orange">*</span>
              )}
            </label>

            {field.type === "text" || field.type === "number" ? (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                required={field.required}
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              >
                <option value="">Select an option</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="flex flex-col gap-2">
                {field.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-black/10 px-4 py-3 transition hover:border-brand-orange hover:bg-brand-orange/5 has-[:checked]:border-brand-orange has-[:checked]:bg-brand-orange/5"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={opt}
                      required={field.required}
                      className="accent-brand-orange"
                    />
                    <span className="text-sm text-brand-black">{opt}</span>
                  </label>
                ))}
              </div>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition resize-none"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        {stepNumber > 1 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/assessment/step/${stepNumber - 1}`)}
          >
            ← Back
          </Button>
        )}
        <Button type="submit" variant="primary" fullWidth={stepNumber === 1}>
          {isLast ? "Submit Assessment" : "Continue →"}
        </Button>
      </div>
    </form>
  );
}
