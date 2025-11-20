'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: 1 | 2;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  const steps = [
    { number: 1, title: 'Базовая информация', description: 'Название, категория, фильтры' },
    { number: 2, title: 'Визуальное оформление', description: 'Дизайн и контент страницы' }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <button
                onClick={() => {
                  if (completedSteps.includes(step.number) || step.number === currentStep) {
                    onStepClick(step.number);
                  }
                }}
                disabled={!completedSteps.includes(step.number) && step.number !== currentStep}
                className={`flex items-center gap-4 ${
                  completedSteps.includes(step.number) || step.number === currentStep
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                    step.number === currentStep
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900'
                      : completedSteps.includes(step.number)
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'bg-gray-200 text-gray-500 dark:bg-neutral-700 dark:text-neutral-400'
                  }`}
                >
                  {completedSteps.includes(step.number) ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                
                <div className="text-left">
                  <div className={`font-semibold ${
                    step.number === currentStep
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-neutral-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-500">
                    {step.description}
                  </div>
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-1 rounded-full transition-all ${
                    completedSteps.includes(step.number)
                      ? 'bg-emerald-600'
                      : 'bg-gray-200 dark:bg-neutral-700'
                  }`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};