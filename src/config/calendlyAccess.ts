// Maps each guide name to their personal Calendly access token (from .env)
// Add each guide's access token as an environment variable in your backend .env

export const guideCalendlyTokenMap: Record<string, string | undefined> = {
  "Jwalant S.": process.env.CALENDLY_TOKEN_JWALANT,
  "Nona": process.env.CALENDLY_TOKEN_NONA,
  "Saachi A.": process.env.CALENDLY_TOKEN_SAACHI,
  "Monika S.": process.env.CALENDLY_TOKEN_MONIKAS,
  "Monika": process.env.CALENDLY_TOKEN_MONIKA,
  "Pooja": process.env.CALENDLY_TOKEN_POOJA,
  "Pritpal": process.env.CALENDLY_TOKEN_PRITPAL,
};

// Returns the access token for a guide, falls back to the global token
export function getGuideCalendlyToken(guideName: string): string | null {
  const token = guideCalendlyTokenMap[guideName];
  if (token) return token;

  // Fallback to global token if guide-specific one not set
  const globalToken = process.env.CALENDLY_ACCESS_TOKEN;
  if (globalToken) return globalToken;

  return null;
}
