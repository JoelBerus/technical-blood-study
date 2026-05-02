import type { BiomarkerCategory } from '@/types';

interface BiomarkerMapping {
  normalized: string;
  category: BiomarkerCategory;
  unit?: string;
}

const BIOMARKER_MAPPINGS: Record<string, BiomarkerMapping> = {
  // Blood Count
  hemoglobina: { normalized: 'Hemoglobin', category: 'blood_count', unit: 'g/dL' },
  hemoglobin: { normalized: 'Hemoglobin', category: 'blood_count', unit: 'g/dL' },
  hematocrito: { normalized: 'Hematocrit', category: 'blood_count', unit: '%' },
  hematocrit: { normalized: 'Hematocrit', category: 'blood_count', unit: '%' },
  eritrocitos: { normalized: 'Red Blood Cells', category: 'blood_count', unit: 'M/µL' },
  leucocitos: { normalized: 'White Blood Cells', category: 'blood_count', unit: 'K/µL' },
  plaquetas: { normalized: 'Platelets', category: 'blood_count', unit: 'K/µL' },
  platelets: { normalized: 'Platelets', category: 'blood_count', unit: 'K/µL' },
  
  // Lipids
  colesterol: { normalized: 'Total Cholesterol', category: 'lipids', unit: 'mg/dL' },
  'colesterol total': { normalized: 'Total Cholesterol', category: 'lipids', unit: 'mg/dL' },
  'total cholesterol': { normalized: 'Total Cholesterol', category: 'lipids', unit: 'mg/dL' },
  trigliceridos: { normalized: 'Triglycerides', category: 'lipids', unit: 'mg/dL' },
  triglycerides: { normalized: 'Triglycerides', category: 'lipids', unit: 'mg/dL' },
  'hdl-colesterol': { normalized: 'HDL Cholesterol', category: 'lipids', unit: 'mg/dL' },
  'hdl cholesterol': { normalized: 'HDL Cholesterol', category: 'lipids', unit: 'mg/dL' },
  'ldl-colesterol': { normalized: 'LDL Cholesterol', category: 'lipids', unit: 'mg/dL' },
  'ldl cholesterol': { normalized: 'LDL Cholesterol', category: 'lipids', unit: 'mg/dL' },
  
  // Metabolic
  glucosa: { normalized: 'Glucose', category: 'metabolic', unit: 'mg/dL' },
  glucose: { normalized: 'Glucose', category: 'metabolic', unit: 'mg/dL' },
  'hemoglobina a1c': { normalized: 'HbA1c', category: 'metabolic', unit: '%' },
  hba1c: { normalized: 'HbA1c', category: 'metabolic', unit: '%' },
  'glycated hemoglobin': { normalized: 'HbA1c', category: 'metabolic', unit: '%' },
  
  // Electrolytes
  sodio: { normalized: 'Sodium', category: 'electrolytes', unit: 'mEq/L' },
  sodium: { normalized: 'Sodium', category: 'electrolytes', unit: 'mEq/L' },
  potasio: { normalized: 'Potassium', category: 'electrolytes', unit: 'mEq/L' },
  potassium: { normalized: 'Potassium', category: 'electrolytes', unit: 'mEq/L' },
  cloruro: { normalized: 'Chloride', category: 'electrolytes', unit: 'mEq/L' },
  chloride: { normalized: 'Chloride', category: 'electrolytes', unit: 'mEq/L' },
  
  // Liver
  'alt (sgpt)': { normalized: 'ALT', category: 'liver', unit: 'U/L' },
  alt: { normalized: 'ALT', category: 'liver', unit: 'U/L' },
  'ast (sgot)': { normalized: 'AST', category: 'liver', unit: 'U/L' },
  ast: { normalized: 'AST', category: 'liver', unit: 'U/L' },
  bilirrubina: { normalized: 'Bilirubin', category: 'liver', unit: 'mg/dL' },
  bilirubin: { normalized: 'Bilirubin', category: 'liver', unit: 'mg/dL' },
  'gama gt': { normalized: 'GGT', category: 'liver', unit: 'U/L' },
  ggt: { normalized: 'GGT', category: 'liver', unit: 'U/L' },
  
  // Kidney
  creatinina: { normalized: 'Creatinine', category: 'kidney', unit: 'mg/dL' },
  creatinine: { normalized: 'Creatinine', category: 'kidney', unit: 'mg/dL' },
  urea: { normalized: 'Blood Urea Nitrogen', category: 'kidney', unit: 'mg/dL' },
  bun: { normalized: 'Blood Urea Nitrogen', category: 'kidney', unit: 'mg/dL' },
  
  // Thyroid
  tsh: { normalized: 'TSH', category: 'thyroid', unit: 'mIU/L' },
  't4 libre': { normalized: 'Free T4', category: 'thyroid', unit: 'ng/dL' },
  'free t4': { normalized: 'Free T4', category: 'thyroid', unit: 'ng/dL' },
  't3 libre': { normalized: 'Free T3', category: 'thyroid', unit: 'pg/mL' },
  'free t3': { normalized: 'Free T3', category: 'thyroid', unit: 'pg/mL' },
};

export function normalizeBiomarkerName(name: string): { normalized: string; category: BiomarkerCategory } {
  const lowerName = name.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(BIOMARKER_MAPPINGS)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return { normalized: value.normalized, category: value.category };
    }
  }
  
  return { normalized: name, category: 'other' };
}

export function standardizeUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  return value;
}

export function getStandardUnit(biomarkerName: string): string | undefined {
  const lowerName = biomarkerName.toLowerCase();
  for (const [key, value] of Object.entries(BIOMARKER_MAPPINGS)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value.unit;
    }
  }
  return undefined;
}