import { Router, type IRouter } from "express";
import { db, alertsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { GetAlertsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(alertsTable)
    .orderBy(sql`${alertsTable.createdAt} desc`)
    .limit(20);

  const mapped = rows.map((r) => ({
    ...r,
    relatedFirIds: r.relatedFirIds.map(Number),
    timestamp: r.createdAt.toISOString(),
  }));

  res.json(GetAlertsResponse.parse(mapped));
});

export default router;
