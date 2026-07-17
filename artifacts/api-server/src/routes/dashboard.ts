import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { caseMasters, accused, alertsTable, districts, crimeHeads } from "@workspace/db";
import { sql, eq } from "drizzle-orm";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityResponse,
  GetCrimeTypeBreakdownResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const [totalFirsRow] = await db.select({ count: sql<number>`count(*)` }).from(caseMasters);
  const [activeRow] = await db.select({ count: sql<number>`count(*)` }).from(caseMasters); // Mocks for now based on lookup
  const [gangRow] = await db.select({ count: sql<number>`count(*)` }).from(alertsTable).where(eq(alertsTable.type, "gang_activity"));

  const summary = {
    totalFirs: totalFirsRow?.count ?? 0,
    activeCases: Math.floor((totalFirsRow?.count ?? 0) * 0.4), // mock breakdown
    solvedCases: Math.floor((totalFirsRow?.count ?? 0) * 0.6),
    arrestsMade: Math.floor((totalFirsRow?.count ?? 0) * 0.72),
    highRiskOffenders: 5,
    crimeHotspots: 8,
    predictedCrimesNextWeek: 23,
    gangNetworksDetected: gangRow?.count ?? 0,
  };

  res.json(GetDashboardSummaryResponse.parse(summary));
});

router.get("/dashboard/recent-activity", async (req, res): Promise<void> => {
  const recentFirsRows = await db
    .select({
      id: caseMasters.id,
      crimeType: crimeHeads.crimeGroupName,
      district: districts.districtName,
      location: caseMasters.briefFacts,
      createdAt: caseMasters.crimeRegisteredDate,
    })
    .from(caseMasters)
    .leftJoin(crimeHeads, eq(caseMasters.crimeMajorHeadId, crimeHeads.id))
    .leftJoin(districts, eq(caseMasters.policeStationId, districts.id)) // rough join for mock
    .orderBy(sql`${caseMasters.crimeRegisteredDate} desc NULLS LAST`)
    .limit(8);

  const activity = recentFirsRows.map((fir, i) => ({
    id: fir.id,
    type: i % 3 === 0 ? "arrest" : i % 3 === 1 ? "fir_filed" : "investigation_update",
    description: `${fir.crimeType || "Incident"} reported`,
    location: fir.district || "Unknown District",
    timestamp: fir.createdAt ? new Date(fir.createdAt).toISOString() : new Date().toISOString(),
    severity: "low" as const,
  }));

  res.json(GetRecentActivityResponse.parse(activity));
});

router.get("/dashboard/crime-type-breakdown", async (req, res): Promise<void> => {
  const rows = await db
    .select({ crimeType: crimeHeads.crimeGroupName, count: sql<number>`count(*)` })
    .from(caseMasters)
    .leftJoin(crimeHeads, eq(caseMasters.crimeMajorHeadId, crimeHeads.id))
    .groupBy(crimeHeads.crimeGroupName)
    .orderBy(sql`count(*) desc`);

  const total = rows.reduce((s, r) => s + r.count, 0);
  const breakdown = rows.map((r) => ({
    crimeType: r.crimeType || "Other",
    count: r.count,
    percentage: total > 0 ? parseFloat(((r.count / total) * 100).toFixed(1)) : 0,
  }));

  res.json(GetCrimeTypeBreakdownResponse.parse(breakdown));
});

export default router;
