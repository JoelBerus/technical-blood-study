import type { Patient, Classification, ReferenceRange } from '@/types';

interface ReferenceRangeConfig {
  male: { low: number; high: number };
  female: { low: number; high: number };
}

const REFERENCE_RANGES: Record<string, ReferenceRangeConfig> = {
  Hemoglobin: {
    male: { low: 13, high: 17 },
    female: { low: 12, high: 15.5 },
  },
  Hematocrit: {
    male: { low: 38.8, high: 50 },
    female: { low: 34.8, high: 44.5 },
  },
  'Red Blood Cells': {
    male: { low: 4.7, high: 6.1 },
    female: { low: 4.2, high: 5.4 },
  },
  'White Blood Cells': {
    male: { low: 4.5, high: 11 },
    female: { low: 4.5, high: 11 },
  },
  Platelets: {
    male: { low: 150, high: 400 },
    female: { low: 150, high: 400 },
  },
  'Total Cholesterol': {
    male: { low: 0, high: 200 },
    female: { low: 0, high: 200 },
  },
  'HDL Cholesterol': {
    male: { low: 40, high: 100 },
    female: { low: 50, high: 100 },
  },
  'LDL Cholesterol': {
    male: { low: 0, high: 100 },
    female: { low: 0, high: 100 },
  },
  Triglycerides: {
    male: { low: 0, high: 150 },
    female: { low: 0, high: 150 },
  },
  Glucose: {
    male: { low: 70, high: 100 },
    female: { low: 70, high: 100 },
  },
  HbA1c: {
    male: { low: 4, high: 5.6 },
    female: { low: 4, high: 5.6 },
  },
  Sodium: {
    male: { low: 136, high: 145 },
    female: { low: 136, high: 145 },
  },
  Potassium: {
    male: { low: 3.5, high: 5 },
    female: { low: 3.5, high: 5 },
  },
  Chloride: {
    male: { low: 98, high: 106 },
    female: { low: 98, high: 106 },
  },
  ALT: {
    male: { low: 7, high: 56 },
    female: { low: 7, high: 56 },
  },
  AST: {
    male: { low: 10, high: 40 },
    female: { low: 10, high: 40 },
  },
  Bilirubin: {
    male: { low: 0.1, high: 1.2 },
    female: { low: 0.1, high: 1.2 },
  },
  GGT: {
    male: { low: 0, high: 55 },
    female: { low: 0, high: 38 },
  },
  Creatinine: {
    male: { low: 0.7, high: 1.3 },
    female: { low: 0.6, high: 1.1 },
  },
  'Blood Urea Nitrogen': {
    male: { low: 7, high: 20 },
    female: { low: 7, high: 20 },
  },
  TSH: {
    male: { low: 0.4, high: 4 },
    female: { low: 0.4, high: 4 },
  },
  'Free T4': {
    male: { low: 0.8, high: 1.8 },
    female: { low: 0.8, high: 1.8 },
  },
  'Free T3': {
    male: { low: 2.3, high: 4.2 },
    female: { low: 2.3, high: 4.2 },
  },
};

const CRITICAL_RANGES: Record<string, { low: number; high: number }> = {
  Hemoglobin: { low: 7, high: 20 },
  Glucose: { low: 50, high: 400 },
  Potassium: { low: 2.5, high: 6.5 },
  Sodium: { low: 120, high: 160 },
  Platelets: { low: 20, high: 1000 },
};



export function getReferenceRange(
  biomarkerName: string,
  patient: Patient
): ReferenceRange | undefined {
  const config = REFERENCE_RANGES[biomarkerName];
  if (!config) return undefined;

  const range = config[patient.sex];
  if (!range) return undefined;

  return {
    low: range.low,
    high: range.high,
    display: `${range.low}-${range.high}`,
  };
}

export function isCritical(value: number, biomarkerName: string): boolean {
  const critical = CRITICAL_RANGES[biomarkerName];
  if (!critical) return false;
  return value < critical.low || value > critical.high;
}

export function classifyBiomarker(
  biomarkerName: string,
  value: number,
  patient: Patient
): Classification {
  const referenceRange = getReferenceRange(biomarkerName, patient);

  if (!referenceRange) {
    return {
      status: 'normal',
      severity: 'info',
      message: 'Reference range not available',
    };
  }

  if (isCritical(value, biomarkerName)) {
    return {
      status: 'critical',
      severity: 'critical',
      message: `Critical value: ${value} is outside safe range`,
    };
  }

  if (value < referenceRange.low) {
    const percentDiff = ((referenceRange.low - value) / referenceRange.low) * 100;
    return {
      status: 'low',
      severity: percentDiff > 20 ? 'critical' : 'warning',
      message: `Below normal range (${referenceRange.display})`,
    };
  }

  if (value > referenceRange.high) {
    const percentDiff = ((value - referenceRange.high) / referenceRange.high) * 100;
    return {
      status: 'high',
      severity: percentDiff > 20 ? 'critical' : 'warning',
      message: `Above normal range (${referenceRange.display})`,
    };
  }

  return {
    status: 'normal',
    severity: 'info',
    message: `Within normal range (${referenceRange.display})`,
  };
}