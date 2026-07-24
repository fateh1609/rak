/**
 * Local RAK Oasis investment advisor — no API key, no external calls.
 *
 * Answers the common investor questions from the project's own facts via
 * keyword-intent matching. It is deterministic and instant (works offline,
 * never rate-limited). It is intentionally NOT a free-form generative model:
 * off-topic questions get a graceful "book a call" fallback.
 *
 * Facts (single source of truth):
 * - Total area: 406 acres. Phase 1: 84.67 acres (launching now).
 * - Standard plot: 1,000 sq.ft. Price: 131 AED/sq.ft (approx 3,275 INR/sq.ft).
 * - Standard plot total: ~131,000 AED. +5% for Garden-facing / Corner plots.
 * - Payment plan: 10% booking (~13,100 AED) + 90% over 5 years / 60 months
 *   (~1,965 AED/month) at 0% interest.
 * - Location: Ras Al Khaimah — a fast-growing tourism and investment hub, with
 *   the Wynn integrated resort (UAE's first gaming resort) opening in 2027.
 */

interface Intent {
  keywords: string[];
  answer: string;
}

// Checked in order; first match wins. Topic intents come before the greeting so
// "hi, what's the ROI?" is treated as an ROI question.
const INTENTS: Intent[] = [
  {
    keywords: ['roi', 'return', 'appreciat', 'worth', 'profit', 'growth', 'good investment', 'invest in 2026', 'capital', 'yield', 'resale', 'value'],
    answer:
      'Ras Al Khaimah is one of the UAE\'s fastest-appreciating markets, driven by the Wynn integrated resort opening in 2027 and sustained tourism growth. Early entry into Phase 1 at 131 AED/sq.ft positions you ahead of that curve, with a 0% interest plan that lets your capital appreciate while you pay in installments. For a tailored projection on your plot, we recommend booking a call with our team.',
  },
  {
    keywords: ['casino', 'wynn', 'tourism', 'resort', 'hotel', 'gaming', 'why rak', 'future', 'boom'],
    answer:
      'RAK is on a strong upward trajectory. The Wynn Al Marjan Island resort — the UAE\'s first integrated gaming resort — opens in 2027 and is expected to draw millions of new visitors annually, lifting land and rental demand across the emirate. RAK Oasis sits within this growth corridor. Book a call to see how this maps to your plot.',
  },
  {
    keywords: ['payment', 'plan', 'emi', 'installment', 'instalment', 'financing', 'finance', 'loan', 'bank', 'down payment', 'booking amount', 'monthly', 'interest'],
    answer:
      'The plan is simple: 10% on booking, then the remaining 90% spread over 5 years (60 monthly installments) at 0% interest — paid directly to the developer, so no bank loan or interest is involved. For a standard 1,000 sq.ft plot that is about 13,100 AED on booking and roughly 1,965 AED per month. Book a call and we will prepare an exact schedule.',
  },
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'how much', 'per sq', 'per square', 'afford', 'expensive', 'cheap', 'budget', 'aed', 'inr', 'promo', 'offer', 'discount'],
    answer:
      'The regular price is 251 AED/sq.ft, but a limited government promotional offer brings it down to just 131 AED/sq.ft for a two-month window. At the promotional rate a standard 1,000 sq.ft plot is around 131,000 AED, and with the 10% booking plan you can secure it from about 13,100 AED upfront. Garden-facing and corner plots carry a 5% premium. This is a significant saving, so we recommend booking a call to lock in the promotional price before it ends.',
  },
  {
    keywords: ['size', 'sqft', 'sq.ft', 'square feet', 'plot size', 'how big', 'dimensions', 'area of plot'],
    answer:
      'Standard plots are 1,000 sq.ft. Garden-facing and corner plots are also available at a 5% premium for their position. Larger configurations can be discussed directly. Book a call and we will walk you through the available layouts in Phase 1.',
  },
  {
    keywords: ['location', 'where', 'ras al khaimah', 'rak ', 'address', 'map', 'nearby', 'airport', 'distance', 'connectivity'],
    answer:
      'RAK Oasis is located in Ras Al Khaimah, the UAE\'s fastest-growing northern emirate, within easy reach of the international airport and the Wynn Al Marjan Island resort. It is a master-planned 406-acre community offering a sanctuary away from the city while staying connected to major landmarks. Book a call for the exact location map and site visit options.',
  },
  {
    keywords: ['acre', 'phase', 'project', 'development', 'master plan', 'masterplan', 'total area', 'how large', 'community'],
    answer:
      'RAK Oasis is a 406-acre master-planned development. Phase 1 — 84.67 acres — is launching now, giving early investors the best entry pricing before later phases release. Book a call to see the masterplan and which plots are currently available.',
  },
  {
    keywords: ['garden', 'corner', 'premium', 'facing', 'view'],
    answer:
      'Garden-facing and corner plots are premium positions offered at a 5% uplift over the standard 131 AED/sq.ft rate — valued for their outlook and placement within the community. Book a call to check which premium plots remain in Phase 1.',
  },
  {
    keywords: ['book', 'call', 'contact', 'buy', 'purchase', 'reserve', 'interested', 'how do i', 'get started', 'sign up', 'register', 'speak', 'talk', 'agent', 'sales'],
    answer:
      'We would be glad to help you secure a plot. You can reach our sales team on +971 58 513 1333 or via WhatsApp, or use the "Book a Call" option on this page and a consultant will guide you through availability, pricing, and the booking process.',
  },
  {
    keywords: ['hi', 'hello', 'hey', 'salaam', 'salam', 'assalam', 'namaste', 'good morning', 'good evening', 'greetings'],
    answer:
      'Hello, and welcome to RAK Oasis. I can help you understand the investment potential, the Ras Al Khaimah location, pricing, and the 5-year payment plan. What would you like to know?',
  },
];

const FALLBACK =
  'That is a great question. I can help with the investment potential, the Ras Al Khaimah location, plot pricing, and the 5-year payment plan for RAK Oasis. For anything more specific, our sales team is happy to assist — reach us on +971 58 513 1333 or use the "Book a Call" option on this page.';

/** Returns a grounded answer for the user's question. Async + tiny delay to
 *  keep the chat UI's typing indicator natural; no network involved. */
export const getInvestmentAdvice = async (userQuestion: string): Promise<string> => {
  const q = (userQuestion || '').toLowerCase();

  await new Promise((resolve) => setTimeout(resolve, 450));

  const match = INTENTS.find((intent) => intent.keywords.some((k) => q.includes(k)));
  return match ? match.answer : FALLBACK;
};
