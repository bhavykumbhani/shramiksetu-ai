import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIProvider {
  generate(prompt: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: any): Promise<T>;
}

export class MockAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const p = prompt.toLowerCase();
    
    // Hinglish / Hindi Work & Name matching
    if (p.includes("kaam") || p.includes("work") || p.includes("job") || p.includes("naukri")) {
      return "If you are looking for work (काम), ShramikSetu can match you with verified contractors. Please complete your Skill Passport so we can find jobs matching your exact skills!";
    }
    
    if (p.includes("surat") || p.includes("kaha") || p.includes("gujarat")) {
      return "Surat is a major industrial hub in Gujarat, famous for textiles and diamond cutting. We have many active welfare schemes and verified contractors registered in Surat.";
    }

    if (p.includes("mera name") || p.includes("my name") || p.includes("naam")) {
      return "Namaskar! Welcome to ShramikSetu. I am here to help you secure your rights and find welfare schemes. How can I assist you today?";
    }

    if (p.includes("scheme") || p.includes("yojana") || p.includes("welfare") || p.includes("yojna")) {
      return "Based on the ShramikSetu deterministic rule engine, you may be eligible for the 'Manav Kalyan Yojana'. Please login to your Worker Portal to verify your exact eligibility.";
    }
    
    if (p.includes("wage") || p.includes("salary") || p.includes("pay") || p.includes("paisa") || p.includes("pagar")) {
      return "The minimum wage (पगार) for skilled workers in Gujarat varies by district. You can use our Wage Fairness tool inside the dashboard to calculate exact discrepancies.";
    }

    return `I understand you said: "${prompt}". \n\n(Note: I am currently running in Offline Mock Mode. To enable the real, highly intelligent AI that can answer anything naturally in Hindi/Gujarati, please add a free GOOGLE_API_KEY to your .env file!)`;
  }
  
  async generateStructured<T>(prompt: string, schema: any): Promise<T> {
    return {} as T;
  }
}

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const systemPrompt = "You are the ShramikSetu AI, an official assistant for migrant workers in Gujarat. Provide helpful, concise answers about labor rights, schemes, and wages. Respond naturally in the exact language/dialect the user speaks (including Hinglish). Keep responses under 4 sentences.";
      const result = await this.model.generateContent(`${systemPrompt}\n\nUser: ${prompt}`);
      return result.response.text();
    } catch (error: any) {
      console.error("Gemini Error:", error);
      return `[GEMINI API ERROR]: ${error?.message || "Unknown error occurred"}. Please check your API key and model limits.`;
    }
  }
  
  async generateStructured<T>(prompt: string, schema: any): Promise<T> {
     return {} as T;
  }
}

export function getAIProvider(): AIProvider {
  if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim() !== '') {
    return new GeminiProvider();
  }
  return new MockAIProvider();
}
