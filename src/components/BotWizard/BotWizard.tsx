import React from 'react';
import { WizardProvider } from './WizardContext';
import { BasicInfo } from './WizardSteps/BasicInfo';
import { Personality } from './WizardSteps/Personality';
import { Knowledge } from './WizardSteps/Knowledge';
import { useWizard } from './WizardContext';

const steps = [
  { title: 'Basic Info', component: BasicInfo },
  { title: 'Personality', component: Personality },
  { title: 'Knowledge', component: Knowledge },
];

function WizardContent() {
  const { currentStep, setCurrentStep, isValid, config } = useWizard();
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save configuration
      localStorage.setItem('botConfig', JSON.stringify(config));
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className={`flex items-center ${
                idx !== steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  idx <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {idx + 1}
              </div>
              {idx !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {steps[currentStep].title}
        </h2>
      </div>

      <CurrentStepComponent />

      <div className="mt-8 flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg ml-auto ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export function BotWizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}