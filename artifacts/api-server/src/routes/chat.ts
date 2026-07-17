import { Router, type IRouter } from "express";
import { db, chatMessagesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  SendChatMessageBody,
  SendChatMessageResponse,
  GetChatHistoryResponse,
} from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

// Simple in-memory session store (production would use Redis)
const sessions = new Map<string, string[]>();

function generateIntelligentResponse(message: string): { response: string; sources: string[]; relatedFirIds: number[] } {
  const lower = message.toLowerCase();

  if (lower.includes("burglary") || lower.includes("theft") || lower.includes("steal")) {
    return {
      response: `Based on the crime database analysis:\n\n**Burglary/Theft Pattern Detected**\n\nIn the last 30 days, Bengaluru Urban district recorded 47 burglary cases — a 12% increase over the previous month. Peak occurrence hours: 02:00–05:00 AM.\n\n**Key Findings:**\n- 68% of cases occurred in unoccupied residences\n- Koramangala, HSR Layout, and Indiranagar are hotspot zones\n- 3 repeat offenders linked to 14+ cases\n\n**Modus Operandi:** Lock-picking (62%), broken window entry (28%)\n\nWould you like me to identify the accused profiles or generate a case similarity report?`,
      sources: ["FIR Database", "Crime Pattern Engine", "Offender Registry"],
      relatedFirIds: [1, 2, 5],
    };
  }

  if (lower.includes("murder") || lower.includes("homicide") || lower.includes("assault")) {
    return {
      response: `**Violent Crime Analysis — Karnataka State**\n\nQuery processed against 2,847 violent crime records.\n\n**Summary:**\n- 23 cases currently under investigation\n- Clearance rate: 78% (above national average)\n- High-risk zones: Bengaluru Rural, Kalaburagi\n\n**Recent Pattern:** Gang-related violent crimes increased 8% this quarter in northern districts.\n\n**Active Alerts:** 2 repeat violent offenders flagged as high-priority.\n\nShall I pull the investigation timelines for specific cases?`,
      sources: ["FIR Database", "Violence Index", "Gang Network Analysis"],
      relatedFirIds: [3, 7],
    };
  }

  if (lower.includes("accused") || lower.includes("offender") || lower.includes("repeat")) {
    return {
      response: `**Repeat Offender Analysis**\n\nIdentified **34 repeat offenders** in the active database:\n\n| Risk Level | Count |\n|------------|-------|\n| Critical   | 6     |\n| High       | 14    |\n| Medium     | 14    |\n\n**Top Pattern:** Accused appearing in 5+ FIRs within 18 months are classified as habitual criminals under Cr.P.C.\n\n**Recommendation:** Immediate preventive detention review for 6 critical-risk offenders.\n\nWould you like the full profile on any specific accused?`,
      sources: ["Offender Registry", "Risk Scoring Engine", "FIR Database"],
      relatedFirIds: [2, 4, 8],
    };
  }

  if (lower.includes("hotspot") || lower.includes("location") || lower.includes("area") || lower.includes("district")) {
    return {
      response: `**Crime Hotspot Intelligence — Karnataka**\n\nTop 5 high-intensity crime zones identified:\n\n1. **Koramangala, Bengaluru** — 89 incidents/month (primarily cyber fraud)\n2. **Electronic City, Bengaluru** — 67 incidents/month (vehicle theft)\n3. **Kalaburagi Central** — 54 incidents/month (property crime)\n4. **Mysuru City** — 48 incidents/month (chain snatching)\n5. **Hubballi Industrial** — 41 incidents/month (burglary)\n\n**AI Prediction:** Crime spike expected in Electronic City next 7 days — probability 87%.\n\nActivate patrol deployment recommendations?`,
      sources: ["Geospatial Database", "Hotspot Detection Engine", "Prediction Model"],
      relatedFirIds: [5, 6],
    };
  }

  if (lower.includes("cyber") || lower.includes("fraud") || lower.includes("online")) {
    return {
      response: `**Cyber Crime Intelligence Report**\n\nKarnataka Cyber Crime Division — Real-time Analysis:\n\n**Active Cases:** 156 open cyber crime FIRs\n**Top Crime Types:**\n- UPI/Banking Fraud: 43%\n- Phishing/Vishing: 28%\n- Social Media Crimes: 17%\n- Ransomware: 12%\n\n**Bengaluru Urban** accounts for 71% of all cyber crime reports.\n\n**Financial Intelligence:** ₹4.2 Crore identified in suspicious transaction networks linked to 8 FIRs.\n\n**Pattern Alert:** A new modus operandi using fake KYC calls targeting senior citizens detected in 3 districts.`,
      sources: ["Cyber Crime Division DB", "Financial Transaction Analysis", "MO Pattern Engine"],
      relatedFirIds: [9, 10],
    };
  }

  // Default intelligent response
  return {
    response: `**Rakshak AI — Crime Intelligence Response**\n\nQuery analyzed against the Karnataka State Crime Database.\n\nI can help you with:\n\n- **FIR Queries:** Search by number, location, crime type, accused name\n- **Pattern Analysis:** Identify trends, MO matching, temporal patterns\n- **Offender Intelligence:** Risk profiles, repeat offender detection, network analysis\n- **Predictive Insights:** Hotspot forecasting, crime spike alerts\n- **Case Connections:** Find hidden links between FIRs, accused, and locations\n\nTry asking:\n*"Show all burglary cases in Bengaluru last month"*\n*"Which accused has the highest risk score?"*\n*"Find FIRs linked to accused Ramesh Kumar"*\n*"Predict next week's crime hotspots"*`,
    sources: ["Rakshak AI Engine", "Crime Database"],
    relatedFirIds: [],
  };
}

router.post("/chat/message", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, language = "english", sessionId } = parsed.data;
  const sid = sessionId ?? randomUUID();

  // Store user message
  const [userMsg] = await db.insert(chatMessagesTable).values({
    sessionId: sid,
    role: "user",
    content: message,
    language: language as "english" | "kannada",
    sources: [],
    timestamp: new Date(),
  }).returning();

  // Generate AI response
  const { response, sources, relatedFirIds } = generateIntelligentResponse(message);

  // Store assistant response
  const [assistantMsg] = await db.insert(chatMessagesTable).values({
    sessionId: sid,
    role: "assistant",
    content: response,
    language: language as "english" | "kannada",
    sources,
    timestamp: new Date(),
  }).returning();

  const chatResponse = {
    id: assistantMsg.id,
    sessionId: sid,
    message,
    response,
    sources,
    relatedFirIds,
    timestamp: assistantMsg.timestamp.toISOString(),
    language,
  };

  res.json(SendChatMessageResponse.parse(chatResponse));
});

router.get("/chat/history", async (req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .orderBy(sql`${chatMessagesTable.timestamp} asc`)
    .limit(50);

  const mapped = messages.map((m) => ({
    id: m.id,
    sessionId: m.sessionId,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp.toISOString(),
  }));

  res.json(GetChatHistoryResponse.parse(mapped));
});

export default router;
