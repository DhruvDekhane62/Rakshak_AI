import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { accused, caseMasters, arrestSurrenders, districts, crimeHeads } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { GetNetworkGraphResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/network/graph", async (req, res): Promise<void> => {
  const accusedRows = await db.select().from(accused).limit(10);
  
  const firsRows = await db
    .select({
      id: caseMasters.id,
      crimeNo: caseMasters.crimeNo,
      crimeType: crimeHeads.crimeGroupName,
      district: districts.districtName,
    })
    .from(caseMasters)
    .leftJoin(crimeHeads, eq(caseMasters.crimeMajorHeadId, crimeHeads.id))
    .leftJoin(districts, eq(caseMasters.policeStationId, districts.id)) // Mock join
    .limit(8);

  const nodes: any[] = [];
  const edges: any[] = [];

  // Add accused nodes
  for (const acc of accusedRows) {
    nodes.push({
      id: `accused-${acc.id}`,
      label: acc.accusedName || `Accused #${acc.id}`,
      type: "accused",
      riskLevel: "medium", // mock
      extraInfo: `Risk: 50/100`,
    });
  }

  // Add FIR nodes
  for (const fir of firsRows) {
    nodes.push({
      id: `fir-${fir.id}`,
      label: fir.crimeNo || `FIR-${fir.id}`,
      type: "fir",
      riskLevel: "high", // mock
      extraInfo: fir.crimeType || "Unknown",
    });
  }

  // Add location nodes for unique districts
  const districtNames = [...new Set(firsRows.map((f) => f.district).filter(Boolean))];
  for (const district of districtNames.slice(0, 4)) {
    nodes.push({
      id: `loc-${district}`,
      label: district as string,
      type: "location",
      riskLevel: null,
      extraInfo: null,
    });
  }

  // Add edges between accused and FIRs
  const links = await db.select().from(arrestSurrenders).limit(20);
  for (const link of links) {
    if (!link.accusedMasterId || !link.caseMasterId) continue;
    const accNode = nodes.find((n) => n.id === `accused-${link.accusedMasterId}`);
    const firNode = nodes.find((n) => n.id === `fir-${link.caseMasterId}`);
    if (accNode && firNode) {
      edges.push({
        id: `e-${link.id}`,
        source: `accused-${link.accusedMasterId}`,
        target: `fir-${link.caseMasterId}`,
        label: "accused in",
        weight: 1.0,
      });
    }
  }

  // Add edges from FIRs to locations
  for (const fir of firsRows) {
    if (!fir.district) continue;
    const locNode = nodes.find((n) => n.id === `loc-${fir.district}`);
    if (locNode) {
      edges.push({
        id: `e-firloc-${fir.id}`,
        source: `fir-${fir.id}`,
        target: `loc-${fir.district}`,
        label: "occurred in",
        weight: 0.7,
      });
    }
  }

  const graph = {
    nodes,
    edges,
    stats: {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      gangsDetected: 0,
      centralNode: accusedRows[0]?.accusedName ?? "Unknown",
    },
  };

  res.json(GetNetworkGraphResponse.parse(graph));
});

export default router;
