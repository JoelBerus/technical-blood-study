import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, validatePDFSize, validatePDFType } from '@/lib/pdf-parser';
import { extractBiomarkersWithFallback, getProviderName } from '@/lib/ai-client';
import { normalizeBiomarkerName, getStandardUnit } from '@/lib/normalizer';
import { classifyBiomarker, getReferenceRange } from '@/lib/classifier';
import type { Patient, ProcessedBiomarker, ReportResult, ReportSummary } from '@/types';

function generateId(): string {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const age = formData.get('age');
    const sex = formData.get('sex') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!validatePDFType(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only PDF files are accepted.' },
        { status: 400 }
      );
    }

    if (!validatePDFSize(file.size)) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    if (!age || !sex) {
      return NextResponse.json(
        { success: false, message: 'Missing demographics (age or sex).' },
        { status: 400 }
      );
    }

    const patient: Patient = {
      age: parseInt(age.toString(), 10),
      sex: sex as 'male' | 'female',
    };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const text = await extractTextFromPDF(buffer);
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Could not extract text from PDF. Please ensure it contains text.' },
        { status: 422 }
      );
    }

    const geminiResult = await extractBiomarkersWithFallback(text, patient);

    if (!geminiResult.data || geminiResult.data.biomarkers.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: geminiResult.error || 'Could not extract biomarkers from the report. Please ensure the PDF contains a blood lab report.' 
        },
        { status: 422 }
      );
    }

    const processedBiomarkers: ProcessedBiomarker[] = geminiResult.data.biomarkers.map((bm) => {
      const { normalized, category } = normalizeBiomarkerName(bm.name);
      const standardUnit = getStandardUnit(bm.name) || bm.unit;
      const referenceRange = getReferenceRange(normalized, patient);
      const classification = classifyBiomarker(normalized, bm.value, patient);

      return {
        id: generateId(),
        originalName: bm.name,
        normalizedName: normalized,
        value: bm.value,
        unit: standardUnit,
        referenceRange,
        category,
        classification,
      };
    });

    const summary: ReportSummary = {
      total: processedBiomarkers.length,
      normal: processedBiomarkers.filter((b) => b.classification.status === 'normal').length,
      abnormal: processedBiomarkers.filter((b) => b.classification.status !== 'normal').length,
    };

    const reportResult: ReportResult = {
      id: generateId(),
      patient,
      processedAt: new Date().toISOString(),
      biomarkers: processedBiomarkers,
      summary,
    };

    const response: { success: boolean; data: ReportResult; warnings?: string[] } = {
      success: true,
      data: reportResult,
    };

    if (geminiResult.incomplete) {
      response.warnings = ['incomplete_extraction'];
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Processing error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { success: false, message: 'Server configuration error. Please contact support.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}