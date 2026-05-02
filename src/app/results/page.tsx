'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { ReportResult, BiomarkerCategory } from '@/types';
import CategoryGroup from '@/components/dashboard/CategoryGroup';
import Summary from '@/components/dashboard/Summary';

function DateDisplay({ dateString }: { dateString: string }) {
  const formatted = useMemo(() => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [dateString]);

  return <span suppressHydrationWarning>{formatted}</span>;
}

function loadResultFromStorage(): { result: ReportResult | null; error: string | null } {
  if (typeof window === 'undefined') {
    return { result: null, error: null };
  }
  const stored = sessionStorage.getItem('reportResult');
  if (!stored) {
    return { result: null, error: 'No results found. Please upload a report first.' };
  }
  try {
    const parsed = JSON.parse(stored);
    return { result: parsed, error: null };
  } catch {
    return { result: null, error: 'Failed to load results' };
  }
}

export default function ResultsPage() {
  const [{ result, error }] = useState(loadResultFromStorage);

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className="bg-error-container text-on-error-container rounded-2xl p-6 mb-8">
            <p className="text-body-md">{error}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Upload
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[1280px] mx-auto px-6 py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const groupedBiomarkers = result.biomarkers.reduce((acc, biomarker) => {
    const category = biomarker.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(biomarker);
    return acc;
  }, {} as Record<BiomarkerCategory, typeof result.biomarkers>);

  const categoryOrder: BiomarkerCategory[] = [
    'blood_count',
    'lipids',
    'metabolic',
    'electrolytes',
    'liver',
    'kidney',
    'thyroid',
    'other',
  ];

  const categoriesWithData = categoryOrder.filter(cat => groupedBiomarkers[cat]?.length > 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Back to upload"
          >
            <svg className="w-6 h-6 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-h1">Analysis Results</h1>
            <p className="text-body-md text-on-surface-variant">
              Processed on <DateDisplay dateString={result.processedAt} />
            </p>
          </div>
        </div>

        <Summary result={result} />

        <div className="space-y-6">
          {categoriesWithData.map((category) => (
            <CategoryGroup
              key={category}
              category={category}
              biomarkers={groupedBiomarkers[category]}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-colors"
          >
            Analyze Another Report
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}