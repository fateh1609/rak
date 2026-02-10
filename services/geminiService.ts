
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert Real Estate Investment Consultant for "RAK Oasis", a new 406-acre development in Ras Al Khaimah (RAK), UAE.
Key Project Details:
- Total Area: 406 Acres.
- Current Launch: Phase 1 (84.67 Acres).
- Plot Size: Standard is 1000 sq.ft.
- Pricing: 101 AED/sq.ft (approx 2520 INR/sq.ft).
- Premium: +5% for Garden Facing or Corner plots.
- Payment Plan: 10% Booking, 90% over 5 Years (EMI).
- Location: Ras Al Khaimah, a booming tourism and investment hub with new casinos (Wynn) and resorts coming up.

Your Goal:
Answer user questions about the investment potential, the location (RAK), and the payment plan. Be professional, persuasive, but grounded in facts. Keep answers concise (under 100 words) and encourage them to "Book a Call" for more details.

IMPORTANT: 
- Do NOT use emojis in your response.
- Use clear, professional, and sophisticated language only.
- Focus on wealth creation and lifestyle.
`;

export const getInvestmentAdvice = async (userQuestion: string): Promise<string> => {
  try {
    // Fix: Initialize GoogleGenAI client directly with process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuestion,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing high traffic. Please contact our sales team directly.";
  }
};
