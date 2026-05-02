import { extractBiomarkersWithFallback as groqExtract } from './providers/groq';

export type AIProvider = 'groq' | 'gemini';

function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === 'gemini' || provider === 'groq') {
    return provider;
  }
  return 'groq';
}

export async function extractBiomarkersWithFallback(
  text: string,
  patient: Parameters<typeof groqExtract>[1]
): ReturnType<typeof groqExtract> {
  const provider = getAIProvider();
  
  if (provider === 'groq') {
    return groqExtract(text, patient);
  }
  
  throw new Error(`AI provider '${provider}' is not implemented yet`);
}

export function getProviderName(): string {
  return getAIProvider();
}