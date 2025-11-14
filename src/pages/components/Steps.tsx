import React from 'react';

interface Step {
  title: string;
  description: React.ReactNode;
}

interface StepsProps {
  steps: Step[];
}

export const Steps: React.FC<StepsProps> = ({ steps }) => {
  return (
    <div className="my-6 space-y-6">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full theme-accent-bg text-white flex items-center justify-center font-semibold text-sm">
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className="w-0.5 h-full theme-border mx-auto mt-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <h3 className="font-semibold text-lg mb-2 theme-text">
              {step.title}
            </h3>
            <div className="theme-text-secondary">
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
