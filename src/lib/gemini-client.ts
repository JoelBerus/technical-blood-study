import { GoogleGenerativeAI } from '@google/generative-ai';
import { cache } from 'react';
import type { Patient } from '@/types';

const GEMINI_MODEL = 'gemini-2.0-flash';

const getGeminiClient = cache((): GoogleGenerativeAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
});

interface GeminiExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  reference_range: string | null;
}

interface GeminiRawResponse {
  biomarkers: GeminiExtractedBiomarker[];
}

interface GeminiNormalizedResponse {
  patient: Patient;
  biomarkers: GeminiExtractedBiomarker[];
}

interface RawDataObject {
  biomarkers?: unknown[];
  patient?: Patient;
}

function validateBiomarkers(data: unknown): GeminiExtractedBiomarker[] {
  if (!data || typeof data !== 'object') return [];
  
  const rawData = data as RawDataObject;
  const biomarkers = rawData.biomarkers;
  if (!Array.isArray(biomarkers)) return [];
  
  return biomarkers
    .filter((b): boolean => {
      const item = b as Record<string, unknown>;
      return typeof item.name === 'string' && typeof item.value === 'number' && typeof item.unit === 'string';
    })
    .map((b) => {
      const item = b as Record<string, unknown>;
      return {
        name: String(item.name),
        value: Number(item.value),
        unit: String(item.unit),
        reference_range: item.reference_range ? String(item.reference_range) : null
      };
    });
}

async function callGemini(prompt: string, attempt: number = 1): Promise<string> {
  const model = getGeminiClient().getGenerativeModel({ 
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    }
  });

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    if (attempt < 2) {
      return callGemini(prompt, attempt + 1);
    }
    throw error;
  }
}

async function extractRawBiomarkers(text: string): Promise<GeminiRawResponse> {
  const prompt = `Extract all biomarkers from this blood lab report text. 

Return ONLY valid JSON with this structure:
{"biomarkers": [{"name": "string", "value": number, "unit": "string", "reference_range": "string or null"}]}

Rules:
- Extract EVERY biomarker you can find in the text
- Keep original language names (Spanish is fine)
- Extract the numeric value only (remove any markers like "ü")
- Reference range format: "low - high unit" or "low - high"
- If no reference range, use null

Lab Report Text:
${text}`;

  const response = await callGemini(prompt);
  
  const cleaned = response.replace(/```json|```/g, '').trim();
  const data = JSON.parse(cleaned);
  const validated = validateBiomarkers(data);
  
  return { biomarkers: validated };
}

async function normalizeBiomarkers(
  biomarkers: GeminiExtractedBiomarker[],
  patient: Patient
): Promise<GeminiNormalizedResponse> {
  const biomarkersJson = JSON.stringify(biomarkers, null, 2);
  
  const prompt = `Normalize the following biomarkers:

1. Translate Spanish names to English
2. Standardize units to common format:
   - x10^6/µL or x10^6/uL for millions/uL
   - x10^3/µL or x10^3/uL for thousands/uL  
   - g/dL, mg/dL, % for others
3. Keep reference ranges as-is

Patient demographics:
- Age: ${patient.age}
- Sex: ${patient.sex}

Input biomarkers:
${biomarkersJson}

Return ONLY valid JSON:
{"patient": {"age": ${patient.age}, "sex": "${patient.sex}"}, "biomarkers": [{"name": "English name", "value": number, "unit": "standard unit", "reference_range": "string or null"}]}`;

  const response = await callGemini(prompt);
  
  const cleaned = response.replace(/```json|```/g, '').trim();
  const data = JSON.parse(cleaned);
  const validated = validateBiomarkers(data);
  
  return {
    patient: data.patient || patient,
    biomarkers: validated
  };
}

export async function extractBiomarkersFromText(
  text: string,
  patient: Patient
): Promise<GeminiNormalizedResponse> {
  try {
    const raw = await extractRawBiomarkers(text);
    
    if (raw.biomarkers.length === 0) {
      throw new Error('No biomarkers extracted');
    }
    
    const normalized = await normalizeBiomarkers(raw.biomarkers, patient);
    
    return normalized;
  } catch (error) {
    console.error('Gemini extraction failed:', error);
    throw error;
  }
}

export async function extractBiomarkersWithFallback(
  text: string,
  patient: Patient
): Promise<{ data: GeminiNormalizedResponse | null; incomplete: boolean; error?: string }> {
  try {
    const result = await extractBiomarkersFromText(text, patient);
    return { data: result, incomplete: false };
  } catch (error) {
    try {
      const simplifiedPrompt = `Extract biomarkers from this lab report. Return JSON: {"patient": {"age": ${patient.age}, "sex": "${patient.sex}"}, "biomarkers": [{"name": "string", "value": 0, "unit": "string", "reference_range": "string or null"}]}

Text: ${text.substring(0, 3000)}`;

      const response = await callGemini(simplifiedPrompt);
      const cleaned = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleaned);
      const validated = validateBiomarkers(data);
      
      if (validated.length > 0) {
        return {
          data: {
            patient: data.patient || patient,
            biomarkers: validated
          },
          incomplete: true,
          error: 'Partial extraction - some biomarkers may be missing'
        };
      }
    } catch (retryError) {
      console.error('Retry also failed:', retryError);
    }
    
    return {
      data: null,
      incomplete: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}