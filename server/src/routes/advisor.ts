import { Router } from 'express';

const router = Router();

const SYSTEM_INSTRUCTION = `
You are an expert Real Estate Investment Consultant for "RAK Oasis", a new 406-acre development in Ras Al Khaimah (RAK), UAE.
Key Project Details:
- Total Area: 406 Acres.
- Current Launch: Phase 1 (84.67 Acres).
- Plot Size: Standard is 1000 sq.ft.
- Pricing: 131 AED/sq.ft (approx 3275 INR/sq.ft).
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

/** Gemini proxy — key stays server-side. Public endpoint (landing page advisor). */
router.post('/advisor', async (req, res) => {
  const question = String(req.body?.question || '').slice(0, 2000);
  if (!question) return res.status(400).json({ error: 'question required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({ answer: 'The advisor is offline right now. Please contact our sales team directly.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: 'user', parts: [{ text: question }] }]
        })
      }
    );
    if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
    const data: any = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "I couldn't generate a response. Please try again.";
    res.json({ answer });
  } catch (e) {
    console.error('Gemini error:', e);
    res.json({ answer: 'I am currently experiencing high traffic. Please contact our sales team directly.' });
  }
});

export default router;
