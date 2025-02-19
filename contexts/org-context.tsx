"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";
import { OrgDataType } from "@/types/org-data";
import type { Step } from "@/types/steps";

const STEPS: Step[] = [
  {
    id: "create-org",
    title: "Create Organisation",
  },
  {
    id: "connect-bank",
    title: "Connect Bank Account",
  },
  {
    id: "select-payments",
    title: "Select Payments to Make",
  },
  {
    id: "make-payment",
    title: "Make Payment",
  },
];

type OrgContextType = {
  orgData: OrgDataType;
  setOrgData: (
    data: OrgDataType | ((prev: OrgDataType) => OrgDataType)
  ) => void;
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  steps: Step[];
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepIndex: number;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const generatePartnerClientId = () => {
  const date = new Date().toISOString().split("T")[0];
  return `crezco-test-api-${date}`;
};

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgData, setOrgData] = useState<OrgDataType>({
    organisationId: "",
    partnerClientId: generatePartnerClientId(),
    companyName: "API Test Org",
  });
  const [currentStepIndex, setCurrentStep] = useState(0);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  return (
    <OrgContext.Provider
      value={{
        orgData,
        setOrgData,
        currentStep: currentStepIndex,
        setCurrentStep,
        steps: STEPS,
        isFirstStep,
        isLastStep,
        currentStepIndex,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
}
