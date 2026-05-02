import type { ReportResult } from '@/types';

interface SummaryProps {
  result: ReportResult;
}

export default function Summary({ result }: SummaryProps) {
  const { summary, patient } = result;
  const abnormalPercent = Math.round((summary.abnormal / summary.total) * 100);

  return (
    <div className="bg-surface-container rounded-2xl p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-label-caps text-on-surface-variant uppercase mb-1">Total Biomarkers</p>
          <p className="text-h2 text-on-surface">{summary.total}</p>
        </div>
        <div>
          <p className="text-label-caps text-on-surface-variant uppercase mb-1">Normal</p>
          <p className="text-h2 text-[#166534]">{summary.normal}</p>
        </div>
        <div>
          <p className="text-label-caps text-on-surface-variant uppercase mb-1">Abnormal</p>
          <p className="text-h2 text-[#9a3412]">{summary.abnormal}</p>
        </div>
        <div>
          <p className="text-label-caps text-on-surface-variant uppercase mb-1">Patient</p>
          <p className="text-body-md text-on-surface">
            {patient.age} yrs, {patient.sex === 'male' ? 'Male' : 'Female'}
          </p>
        </div>
      </div>

      {abnormalPercent > 0 && (
        <div className="mt-6 pt-6 border-t border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${100 - abnormalPercent}%` }}
              />
            </div>
            <span className="text-body-sm text-on-surface-variant">
              {100 - abnormalPercent}% normal
            </span>
          </div>
        </div>
      )}
    </div>
  );
}