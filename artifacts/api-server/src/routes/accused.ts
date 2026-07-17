import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { 
  accused, caseMasters, arrestSurrenders, crimeHeads, units, caseStatusMasters, districts 
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  ListAccusedQueryParams,
  ListAccusedResponse,
  GetAccusedResponse,
  GetAccusedNetworkResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/accused", async (req, res): Promise<void> => {
  const query = ListAccusedQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { limit = 20 } = query.data;

  const rows = await db
    .select()
    .from(accused)
    .limit(limit);

  const mapped = await Promise.all(
    rows.map(async (r) => {
      // Find case/district info
      const [caseRow] = await db
        .select({
          crimeType: crimeHeads.crimeGroupName,
          district: districts.districtName,
        })
        .from(caseMasters)
        .leftJoin(crimeHeads, eq(caseMasters.crimeMajorHeadId, crimeHeads.id))
        .leftJoin(units, eq(caseMasters.policeStationId, units.id))
        .leftJoin(districts, eq(units.districtId, districts.id))
        .where(r.caseMasterId ? eq(caseMasters.id, r.caseMasterId) : undefined);

      const sameNameAccused = await db
        .select()
        .from(accused)
        .where(eq(accused.accusedName, r.accusedName || ""));
      const isRepeatOffender = sameNameAccused.length > 1;

      const riskScore = isRepeatOffender ? 85 : 45;
      const riskLevel = riskScore >= 80 ? ("high" as const) : ("medium" as const);

      return {
        id: r.id,
        name: r.accusedName || `Accused #${r.id}`,
        age: r.ageYear || 30,
        gender: r.genderId === 1 ? "male" : "female",
        district: caseRow?.district || "Unknown",
        totalFirs: isRepeatOffender ? sameNameAccused.length : 1,
        riskScore,
        riskLevel,
        isRepeatOffender,
        crimeTypes: caseRow?.crimeType ? [caseRow.crimeType] : ["Unknown"],
      };
    })
  );

  res.json(ListAccusedResponse.parse(mapped));
});

router.get("/accused/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [acc] = await db.select().from(accused).where(eq(accused.id, id));
  if (!acc) {
    res.status(404).json({ error: "Accused not found" });
    return;
  }

  // Get FIR history via arrestSurrenders
  const firLinks = await db
    .select({ firId: arrestSurrenders.caseMasterId })
    .from(arrestSurrenders)
    .where(eq(arrestSurrenders.accusedMasterId, id))
    .limit(10);

  const firHistory = await Promise.all(
    firLinks.map(async (link) => {
      if (!link.firId) return null;
      
      const [firRow] = await db
        .select({
          id: caseMasters.id,
          firNumber: caseMasters.crimeNo,
          crimeType: crimeHeads.crimeGroupName,
          date: caseMasters.incidentFromDate,
          policeStation: units.unitName,
          status: caseStatusMasters.caseStatusName,
        })
        .from(caseMasters)
        .leftJoin(crimeHeads, eq(caseMasters.crimeMajorHeadId, crimeHeads.id))
        .leftJoin(units, eq(caseMasters.policeStationId, units.id))
        .leftJoin(caseStatusMasters, eq(caseMasters.caseStatusId, caseStatusMasters.id))
        .where(eq(caseMasters.id, link.firId));
        
      if (!firRow) return null;
      
      return {
        firId: firRow.id,
        firNumber: firRow.firNumber || `FIR-${firRow.id}`,
        crimeType: firRow.crimeType || "Unknown",
        date: firRow.date ? firRow.date.toISOString() : new Date().toISOString(),
        policeStation: firRow.policeStation || "Unknown",
        status: (firRow.status || "open").toLowerCase(),
      };
    })
  );

  const history = firHistory.filter((f): f is NonNullable<typeof f> => !!f);
  const firstFir = history[0];

  // Try to find the district dynamically
  const [caseRow] = await db
    .select({
      district: districts.districtName,
    })
    .from(caseMasters)
    .leftJoin(units, eq(caseMasters.policeStationId, units.id))
    .leftJoin(districts, eq(units.districtId, districts.id))
    .where(acc.caseMasterId ? eq(caseMasters.id, acc.caseMasterId) : undefined);

  const district = caseRow?.district || "Unknown";

  const sameNameAccused = await db
    .select()
    .from(accused)
    .where(eq(accused.accusedName, acc.accusedName || ""));
  const isRepeatOffender = sameNameAccused.length > 1;

  const crimeTypes = history.map(f => f.crimeType);
  const riskScore = isRepeatOffender ? 85 : 45;
  const riskLevel = riskScore >= 80 ? ("high" as const) : ("medium" as const);
  const hasViolentCrimes = crimeTypes.some(ct => ["murder", "assault", "robbery"].includes(ct.toLowerCase()));
  const usedWeapons = hasViolentCrimes;
  const networkSize = isRepeatOffender ? 4 : 2;

  const riskFactors = hasViolentCrimes 
    ? ["History of violent offenses", "High risk of recidivism"] 
    : ["Property crime offenses", "Moderate threat level"];
    
  const behavioralProfile = isRepeatOffender 
    ? "Subject has multiple active listings in the state registry. Shows persistent criminal patterns with potential gang affiliations. Under continuous monitoring."
    : "Subject has a single documented offense. No immediate weapon threats or violent criminal patterns detected. Monitored under standard local guidelines.";

  const profile = {
    id: acc.id,
    name: acc.accusedName || `Accused #${acc.id}`,
    age: acc.ageYear || 30,
    gender: acc.genderId === 1 ? "male" : "female",
    district,
    totalFirs: isRepeatOffender ? sameNameAccused.length : 1,
    riskScore,
    riskLevel,
    isRepeatOffender,
    hasViolentCrimes,
    usedWeapons,
    networkSize,
    crimeTypes: crimeTypes.length > 0 ? crimeTypes : ["Unknown"],
    firHistory: history,
    behavioralProfile,
    riskFactors,
  };

  res.json(GetAccusedResponse.parse(profile));
});

router.get("/accused/:id/network", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [acc] = await db.select().from(accused).where(eq(accused.id, id));
  if (!acc) {
    res.status(404).json({ error: "Accused not found" });
    return;
  }

  // Basic mock network structure
  type NodeType = "accused" | "victim" | "location" | "vehicle" | "phone" | "bank" | "fir";
  const nodes: Array<{ id: string; label: string; type: NodeType; riskLevel: string | null; extraInfo: string | null }> = [
    { id: `accused-${acc.id}`, label: acc.accusedName || `Accused #${acc.id}`, type: "accused", riskLevel: "medium", extraInfo: `Risk: 50/100` },
    { id: `location-1`, label: "District Name", type: "location", riskLevel: null, extraInfo: "Primary location" },
    { id: `phone-1`, label: `+91 98XXX ${acc.id}0${acc.id}0`, type: "phone", riskLevel: null, extraInfo: "Registered device" },
  ];

  const edges = [
    { id: `e1`, source: `accused-${acc.id}`, target: `location-1`, label: "operates in", weight: 0.9 },
    { id: `e2`, source: `accused-${acc.id}`, target: `phone-1`, label: "uses", weight: 0.8 },
  ];

  const firLinks = await db
    .select({ firId: arrestSurrenders.caseMasterId })
    .from(arrestSurrenders)
    .where(eq(arrestSurrenders.accusedMasterId, id))
    .limit(5);

  for (const link of firLinks) {
    if (link.firId) {
      const firNode = { id: `fir-${link.firId}`, label: `FIR #${link.firId}`, type: "fir" as const, riskLevel: null, extraInfo: null };
      nodes.push(firNode);
      edges.push({ id: `e-fir-${link.firId}`, source: `accused-${acc.id}`, target: `fir-${link.firId}`, label: "accused in", weight: 1.0 });
    }
  }

  const graph = {
    nodes,
    edges,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      gangsDetected: 0,
      centralNode: acc.accusedName || `Accused #${acc.id}`,
    },
  };

  res.json(GetAccusedNetworkResponse.parse(graph));
});

export default router;
