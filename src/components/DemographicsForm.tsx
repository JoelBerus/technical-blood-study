'use client';

import { useState, useEffect } from 'react';
import type { Patient } from '@/types';

interface DemographicsFormProps {
  onChange: (demographics: Patient) => void;
}

export default function DemographicsForm({ onChange }: DemographicsFormProps) {
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female' | ''>('');

  useEffect(() => {
    if (age && sex) {
      onChange({ age: parseInt(age, 10), sex });
    }
  }, [age, sex, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="age" className="block text-label-caps text-on-surface-variant mb-2 uppercase">
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="0"
          max="150"
          className="w-full px-4 py-3 bg-surface-container rounded-lg text-body-md text-on-surface placeholder-on-surface-variant border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none transition-colors"
          placeholder="Enter your age"
        />
      </div>

      <div>
        <label htmlFor="sex" className="block text-label-caps text-on-surface-variant mb-2 uppercase">
          Biological Sex
        </label>
        <select
          id="sex"
          value={sex}
          onChange={(e) => setSex(e.target.value as 'male' | 'female')}
          className="w-full px-4 py-3 bg-surface-container rounded-lg text-body-md text-on-surface border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none transition-colors appearance-none cursor-pointer"
        >
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <p className="text-body-sm text-on-surface-variant">
        Required for accurate biomarker classification based on reference ranges.
      </p>
    </div>
  );
}