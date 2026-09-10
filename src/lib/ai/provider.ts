import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIProvider {
  generate(prompt: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: any): Promise<T>;
}

export class MockAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const p = prompt.toLowerCase().trim();
    
    // Greetings & Introductions
    if (p.includes("hi") || p.includes("hello") || p.includes("namaste") || p.includes("hey") || p.includes("kem cho") || p.includes("pranam") || p.includes("nam") || p.includes("naam") || p.includes("name")) {
      return "Namaskar! Welcome to ShramikSetu (श्रमिकसेतु). I am your AI Assistant for labor rights, Gujarat welfare schemes, minimum wages, and job opportunities. How can I assist you today?";
    }
    
    // Hinglish / Hindi Work & Location matching
    if (p.includes("kaam") || p.includes("work") || p.includes("job") || p.includes("naukri")) {
      return "If you are looking for work (काम), ShramikSetu can match you with verified contractors across Gujarat. Please complete your Skill Passport so contractors can offer you jobs matching your exact skills!";
    }
    
    if (p.includes("surat") || p.includes("kaha") || p.includes("gujarat") || p.includes("ahmedabad") || p.includes("rajkot")) {
      return "Surat and major Gujarat cities are core hubs for textiles, construction, and diamond cutting. We have active welfare schemes (like Shramik Basera Yojana) and verified contractors registered in your district.";
    }

    if (p.includes("scheme") || p.includes("yojana") || p.includes("welfare") || p.includes("yojna")) {
      return "Based on your worker profile, you may be eligible for schemes like 'Manav Kalyan Yojana', 'BOCW Welfare Fund', and 'Shramik Basera Yojana'. Please visit the Welfare Schemes section in your worker portal to apply.";
    }
    
    if (p.includes("wage") || p.includes("salary") || p.includes("pay") || p.includes("paisa") || p.includes("pagar") || p.includes("rate")) {
      return "The minimum wage (पगार) for skilled workers in Gujarat is regulated by government standards. You can use our Wage Fairness tool inside your dashboard to verify if your current wage meets official benchmarks.";
    }

    if (p.includes("help") || p.includes("madad") || p.includes("support") || p.includes("rights") || p.includes("complain") || p.includes("grievance")) {
      return "ShramikSetu is here to protect your rights! You can file an anonymous safety or wage grievance through our Grievance Portal, generate a automated Legal Notice, or reach out to labor authorities directly.";
    }

    return `Namaskar! Thank you for reaching out to ShramikSetu (श्रमिकसेतु). I am here to help you with job search, wage checks, legal assistance, and Gujarat government welfare schemes. Feel free to ask any question in Hindi, Gujarati, or English!`;
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
    this.model = this.genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const systemPrompt = "You are the ShramikSetu AI, an official assistant for migrant workers in Gujarat. Provide helpful, concise answers about labor rights, schemes, and wages. Respond naturally in the exact language/dialect the user speaks (including Hinglish). Keep responses under 4 sentences.";
      const result = await this.model.generateContent(`${systemPrompt}\n\nUser: ${prompt}`);
      return result.response.text();
    } catch (error: any) {
      console.error("Gemini Error, falling back to intelligent offline assistant:", error);
      const mock = new MockAIProvider();
      return mock.generate(prompt);
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
