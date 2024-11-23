import React, { createContext, useContext, useState } from 'react';

interface BotConfig {
  name: string;
  avatar: string;
  personality: string[];
  responseStyle: 'formal' | 'casual' | 'friendly';
  domain: string[];
  temperature: number;
  maxTokens: number;
}

interface WizardContextType {
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
}

const defaultConfig: BotConfig = {
  name: '',
  avatar: 'default',
  personality: [],
  responseStyle: 'friendly',
  domain: [],
  temperature: 0.7,
  maxTokens: 1024
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BotConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const updateConfig = (updates: Partial<BotConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <WizardContext.Provider value={{
      config,
      updateConfig,
      currentStep,
      setCurrentStep,
      isValid,
      setIsValid
    }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}