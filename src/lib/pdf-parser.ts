import { extractText, getDocumentProxy } from 'unpdf';
import { normalizePDFText, extractPageContent } from './text-normalizer';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const pdf = await getDocumentProxy(uint8Array);
    const { text } = await extractText(pdf, { mergePages: true });
    
    const pageContent = extractPageContent(text);
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