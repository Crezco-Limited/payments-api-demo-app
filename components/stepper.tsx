"use client";

import { Check } from "lucide-react";
import { useOrg } from "@/contexts/org-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Stepper() {
  const { orgData, steps, currentStepIndex } = useOrg();

  const getHeadingText = () => {
    switch (currentStepIndex) {
      case 0:
        return steps[0].title;
      case 1:
        return `${steps[1].title} for ${orgData.companyName || ""}`;
      case 2:
        return steps[2].title;
      case 3:
        return steps[3].title;
      default:
        return "Error";
    }
  };

  return (
    <div className="container max-w-2xl mx-auto pt-8 gap-4 flex flex-col">
      <div className="flex items-center justify-between w-full ">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center w-full last:w-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className={`flex items-center justify-center rounded-full border-2 w-7 h-7 text-sm shrink-0 ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className="flex justify-center items-center">
                        {index + 1}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{step.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {index < steps.length - 1 && (
              <div
                className={`w-full h-[2px] ${
                  index < currentStepIndex ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center w-full">
        {getHeadingText()}
      </h1>
    </div>
  );
}
