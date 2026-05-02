import { PDFParse } from 'pdf-parse';
import { normalizePDFText, extractPageContent } from './text-normalizer';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const workerPath = 'file://' + process.cwd() + '/node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs';
    PDFParse.setWorker(workerPath);
    
    const pdf = new PDFParse({ data: buffer });
    const textResult = await pdf.getText();
    
    const rawText = textResult.text || '';
    
    const pageContent = extractPageContent(rawText);
    
    const normalized = normalizePDFText(pageContent);
    
    return normalized;
  } catch (err) {
    console.error('PDF extraction error:', err);
    throw new Error('Failed to extract text from PDF');
  }
}

export function validatePDFSize(size: number): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return size <= MAX_SIZE;
}

export function validatePDFType(type: string): boolean {
  return type === 'application/pdf';
}