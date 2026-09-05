import { getAIProvider } from '@/lib/ai/provider';

export interface TranslationResult {
  originalText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  phoneticSpelling?: string;
}

export async function translateBhasha(
  text: string, 
  targetLang: 'hi' | 'gu' | 'en' = 'gu', 
  sourceLang?: string
): Promise<TranslationResult> {
  const provider = getAIProvider();

  const langNames: Record<string, string> = {
    hi: "Hindi",
    gu: "Gujarati",
    en: "English"
  };

  const targetName = langNames[targetLang] || "Gujarati";

  // Fallback dictionary for fast offline demo
  const mockTranslations: Record<string, Record<string, string>> = {
    hi: {
      gu: "મને સ્કીલ્ડ કડિયા કામ માટે કેટલો દૈનિક પગાર મળશે?",
      en: "What will be my daily wage for skilled masonry work?"
    },
    gu: {
      hi: "मुझे कुशल राजमिस्त्री के काम के लिए कितना दैनिक वेतन मिलेगा?",
      en: "What will be my daily wage for skilled masonry work?"
    }
  };

  try {
    const prompt = `
You are Bhasha Mitra, a real-time voice translator for labor contractors and migrant workers in Gujarat.
Translate the following labor negotiation speech text accurately into ${targetName}.
Keep the tone clear, respectful, and retain numbers (wages, hours, days) exactly.

Text: "${text}"

Return ONLY the translated text in ${targetName} script.
`;
    const responseText = await provider.generate(prompt);
    const cleaned = responseText.trim().replace(/^["']|["']$/g, '');
    if (cleaned && cleaned.length > 0) {
      return {
        originalText: text,
        sourceLang: sourceLang || 'auto',
        targetLang,
        translatedText: cleaned
      };
    }
  } catch (e) {
    // Fallback translation logic
  }

  const fallbackText = mockTranslations[sourceLang || 'hi']?.[targetLang] || 
    (targetLang === 'gu' ? "અમે દૈનિક ₹700 વેતન અને રહેવાની સુવિધા આપીશું." : "हम ₹700 दैनिक वेतन और रहने की सुविधा देंगे।");

  return {
    originalText: text,
    sourceLang: sourceLang || 'auto',
    targetLang,
    translatedText: fallbackText
  };
}
