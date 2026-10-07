export const BRIEFING_DURATION = 60;

export const briefing = [
  { at: 0, text: "Good morning. This is Supply Signal, your daily intelligence briefing on the AI supply chain. Three signals need your attention today." },
  { at: 10, text: "TSMC leads today's risk watch at 78. Proposed export controls are adding uncertainty to advanced chip shipments. Samsung Foundry is the closest alternative." },
  { at: 20, text: "SK hynix risk has climbed to 64. High-bandwidth memory demand continues to outpace supply, with longer lead times for next-generation AI accelerators." },
  { at: 30, text: "ASML remains stable at 32. Delivery schedules are holding, though licensing exposure remains a factor. Monitor equipment shipments into restricted markets." },
  { at: 40, text: "Since yesterday, TSMC is up 12 points and SK hynix is up 6. NVIDIA and Azure remain on our watchlist with no material change." },
  { at: 50, text: "Today's priority: review advanced-node dependencies, confirm memory allocations, and keep alternative suppliers warm. That is your signal. Stay ahead of the chain." },
];

export type RiskLevel = 'high' | 'moderate' | 'low';
export type SupplierRisk = { name: string; category: string; code: string; score: number; change: number; level: RiskLevel; headline: string; history: number[]; alternative: string };
export const risks: SupplierRisk[] = [
  { name: 'TSMC', category: 'SEMICONDUCTOR FOUNDRY', code: 'TW', score: 78, change: 12, level: 'high', headline: 'New export-control rules raise advanced-chip exposure.', history: [43, 48, 46, 59, 56, 66, 78], alternative: 'Samsung Foundry' },
  { name: 'SK hynix', category: 'HIGH-BANDWIDTH MEMORY', code: 'KR', score: 64, change: 6, level: 'moderate', headline: 'HBM demand outpaces supply as lead times extend.', history: [38, 44, 40, 49, 53, 58, 64], alternative: 'Micron' },
  { name: 'ASML', category: 'LITHOGRAPHY EQUIPMENT', code: 'NL', score: 32, change: -3, level: 'low', headline: 'EUV delivery outlook holds steady despite licensing risk.', history: [38, 42, 37, 40, 35, 35, 32], alternative: 'Nikon · DUV only' },
];

export function getMockAnswer(question: string): string {
  const query = question.toLowerCase();
  if (query.includes('asml')) return 'ASML fell 3 points to 32/100. EUV delivery schedules remain stable, with no new disruption in this mock briefing. Nikon is a DUV-only alternative, not a direct replacement for EUV.';
  if (query.includes('alternative') || query.includes('samsung')) return 'Samsung Foundry is the nearest alternative to TSMC; Micron offers an alternative for SK hynix memory. Qualification and capacity must be confirmed. Nikon supplies DUV equipment, not a like-for-like EUV replacement.';
  if (query.includes('nvidia') || query.includes('azure')) return 'NVIDIA and Azure have no material change since yesterday in this mock briefing. NVIDIA remains exposed to upstream chip and memory capacity; Azure remains on the cloud-capacity watchlist.';
  return 'TSMC rose 12 points to 78/100 after proposed export-control changes. SK hynix rose 6 points to 64/100 as HBM lead times extended. ASML eased 3 points to 32/100 with delivery schedules holding steady.';
}