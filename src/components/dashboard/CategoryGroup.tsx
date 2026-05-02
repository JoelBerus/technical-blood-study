'use client';

import { useState } from 'react';
import type { ProcessedBiomarker, BiomarkerCategory } from '@/types';
import BiomarkerCard from './BiomarkerCard';

interface CategoryGroupProps {
  category: BiomarkerCategory;
  biomarkers: ProcessedBiomarker[];
}

const categoryLabels: Record<BiomarkerCategory, string> = {
  blood_count: 'Blood Count',
  lipids: 'Lipids Panel',
  metabolic: 'Metabolic',
  electrolytes: 'Electrolytes',
  liver: 'Liver Function',
  kidney: 'Kidney Function',
  thyroid: 'Thyroid',
  other: 'Other',
};

export default function CategoryGroup({ category, biomarkers }: CategoryGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const abnormalCount = biomarkers.filter(b => b.classification.status !== 'normal').length;
  const hasAbnormal = abnormalCount > 0;

  return (
    <div className="bg-surface-container-low rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 text-on-surface">{categoryLabels[category]}</h3>
          {hasAbnormal && (
            <span className="bg-error-container text-on-error-container text-label-caps px-2 py-0.5 rounded-full">
              {abnormalCount} abnormal
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {biomarkers.map((biomarker) => (
            <BiomarkerCard key={biomarker.id} biomarker={biomarker} />
          ))}
        </div>
      )}
    </div>
  );
}