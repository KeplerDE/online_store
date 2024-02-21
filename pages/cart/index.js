'use client';

import React, { useState } from "react";
import Step1 from "@/components/cart/Step1";
import Step2 from "@/components/cart/Step2";
import Step3 from "@/components/cart/Step3";

export default function Cart() {
  const [step, setStep] = useState(1);

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <Step1 onNextStep={handleNextStep} />}
      {step === 2 && (
        <Step2 onPrevStep={handlePrevStep} onNextStep={handleNextStep} />
      )}
      {step === 3 && <Step3 onPrevStep={handlePrevStep} />}
    </div>
  );
}
