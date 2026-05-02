'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone from '@/components/UploadZone';
import DemographicsForm from '@/components/DemographicsForm';
import type { Patient } from '@/types';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [demographics, setDemographics] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDemographicsChange = useCallback((demo: Patient) => {
    setDemographics(demo);
    setError(null);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!demographics) {
      setError('Please enter your demographics first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('age', demographics.age.toString());
      formData.append('sex', demographics.sex);

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (!response.ok) {
        const text = await response.text();
        try {
          data = JSON.parse(text);
          throw new Error(data.message || `Server error: ${response.status}`);
        } catch {
          throw new Error(text || `Server error: ${response.status}`);
        }
      }

      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      data = await response.json();

      if (data.success && data.data) {
        sessionStorage.setItem('reportResult', JSON.stringify(data.data));
        router.push('/results');
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  }, [demographics, router]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-4">Clinical Clarity</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Upload your blood lab report to get instant AI-powered biomarker analysis and classification based on your demographics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
            <h2 className="text-h3 mb-6">Your Information</h2>
            <DemographicsForm onChange={handleDemographicsChange} />
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
            <h2 className="text-h3 mb-6">Upload Report</h2>
            <UploadZone
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              progress={uploadProgress}
              disabled={!demographics}
            />
            {error && (
              <p className="mt-4 text-sm text-error">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-body-sm text-on-surface-variant">
          <p>Your data is processed securely and never stored.</p>
        </div>
      </div>
    </main>
  );
}