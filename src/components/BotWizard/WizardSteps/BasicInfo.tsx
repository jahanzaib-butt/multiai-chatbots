import React, { useEffect } from 'react';
import { useWizard } from '../WizardContext';

export function BasicInfo() {
  const { config, updateConfig, setIsValid } = useWizard();

  useEffect(() => {
    setIsValid(!!config.name && config.name.length >= 2);
  }, [config.name, setIsValid]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bot Name
        </label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter bot name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar Style
        </label>
        <select
          value={config.avatar}
          onChange={(e) => updateConfig({ avatar: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="technical">Technical</option>
        </select>
      </div>
    </div>
  );
}