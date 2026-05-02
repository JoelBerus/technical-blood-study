import type { ProcessedBiomarker } from '@/types';
import StatusBadge from './StatusBadge';

interface BiomarkerCardProps {
  biomarker: ProcessedBiomarker;
}

export default function BiomarkerCard({ biomarker }: BiomarkerCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-body-md font-semibold text-on-surface">
            {biomarker.normalizedName}
          </h4>
          {biomarker.originalName !== biomarker.normalizedName && (
            <p className="text-body-sm text-on-surface-variant mt-1">
              {biomarker.originalName}
            </p>
          )}
        </div>
        <StatusBadge status={biomarker.classification.status} />
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-h2 text-on-surface">
          {biomarker.value}
        </span>
        <span className="text-body-md text-on-surface-variant">
          {biomarker.unit}
        </span>
      </div>

      {biomarker.referenceRange && (
        <p className="text-body-sm text-on-surface-variant">
          Reference: {biomarker.referenceRange.display} {biomarker.unit}
        </p>
      )}

      <p className="text-body-sm text-on-surface-variant mt-2">
        {biomarker.classification.message}
      </p>
    </div>
  );
}