import { notFound } from "next/navigation";
import { ASSESSMENT_STEPS } from "@/lib/assessmentSteps";
import StepForm from "./StepForm";

interface PageProps {
  params: Promise<{ step: string }>;
}

export function generateStaticParams() {
  return ASSESSMENT_STEPS.map((s) => ({ step: String(s.id) }));
}

export default async function StepPage({ params }: PageProps) {
  const { step } = await params;
  const stepNumber = parseInt(step, 10);
  const assessmentStep = ASSESSMENT_STEPS.find((s) => s.id === stepNumber);

  if (!assessmentStep) notFound();

  return <StepForm step={assessmentStep} stepNumber={stepNumber} />;
}
