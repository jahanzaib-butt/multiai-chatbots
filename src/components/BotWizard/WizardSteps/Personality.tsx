import React, { useEffect } from 'react';
import { useWizard } from '../WizardContext';

const PERSONALITY_TRAITS = [
  'Friendly', 'Professional', 'Technical', 'Creative',
  'Humorous', 'Formal', 'Casual', 'Empathetic'
];

export function Personality() {
  const { config, updateConfig, setIsValid } = useWizard();

  useEffect(() => {
    setIsValid(config.personality.length > 0);
  }, [config.personality, setIsValid]);

  const toggleTrait = (trait: string) => {
    const newTraits = config.personality.includes(trait)
      ? config.personality.filter(t => t !== trait)
      : [...config.personality, trait];
    updateConfig({ personality: newTraits });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select Personality Traits
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PERSONALITY_TRAITS.map(trait => (
            <button
              key={trait}
              onClick={() => toggleTrait(trait)}
              className={`px-4 py-2 rounded-lg border ${
                config.personality.includes(trait)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {trait}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Response Style
        </label>
        <select
          value={config.responseStyle}
          onChange={(e) => updateConfig({ 
            responseStyle: e.target.value as 'formal' | 'casual' | 'friendly' 
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
        </select>
      </div>
    </div>
  );
}