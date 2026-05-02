export interface Patient {
  age: number;
  sex: 'male' | 'female';
}

export type BiomarkerCategory =
  | 'blood_count'
  | 'lipids'
  | 'metabolic'
  | 'electrolytes'
  | 'liver'
  | 'kidney'
  | 'thyroid'
  | 'other';

export interface ReferenceRange {
  low: number;
  high: number;
  display: string;
}

export interface Biomarker {
  id: string;
  originalName: string;
  normalizedName: string;
  value: number;
  unit: string;
  referenceRange?: ReferenceRange;
  category: BiomarkerCategory;
}

export type ClassificationStatus = 'normal' | 'low' | 'high' | 'critical';
export type ClassificationSeverity = 'info' | 'warning' | 'critical';

export interface Classification {
  status: ClassificationStatus;
  severity: ClassificationSeverity;
  message: string;
}

export interface ProcessedBiomarker extends Biomarker {
  classification: Classification;
}

export interface ReportSummary {
  total: number;
  normal: number;
  abnormal: number;
}

export interface ReportResult {
  id: string;
  patient: Patient;
  processedAt: string;
  biomarkers: ProcessedBiomarker[];
  summary: ReportSummary;
}

export interface UploadRequest {
  file: File;
  demographics: Patient;
}

export interface ProcessingResponse {
  success: boolean;
  data?: ReportResult;
  error?: string;
  message?: string;
}

export interface GeminiExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  reference_range?: string;
}