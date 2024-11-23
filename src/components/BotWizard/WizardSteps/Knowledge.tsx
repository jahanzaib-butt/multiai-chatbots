import React, { useEffect } from 'react';
import { useWizard } from '../WizardContext';

const DOMAINS = [
  'General Knowledge', 'Technical Support', 'Customer Service',
  'Programming', 'Science', 'Business', 'Education', 'Healthcare'
];

export function Knowledge() {
  const { config, updateConfig, setIsValid } = useWizard();

  useEffect(() => {
    setIsValid(config.domain.length > 0);
  }, [config.domain, setIsValid]);

  const toggleDomain = (domain: string) => {
    const newDomains = config.domain.includes(domain)
      ? config.domain.filter(d => d !== domain)
      : [...config.domain, domain];
    updateConfig({ domain: newDomains });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Knowledge Domains
        </label>
        <div className="grid grid-cols-2 gap-3">
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`px-4 py-2 rounded-lg border ${
                config.domain.includes(domain)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature (Creativity: {config.temperature})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Tokens (Response Length: {config.maxTokens})
          </label>
          <input
            type="range"
            min="256"
            max="2048"
            step="256"
            value={config.maxTokens}
            onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}