import { Router, type IRouter } from "express";
import { GetCrimePredictionsResponse, GetRiskAreasResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const PREDICTIONS = [
  { id: 1, location: "Electronic City Phase 2", district: "Bengaluru Urban", crimeType: "Vehicle Theft", probability: 0.87, predictedDate: "2025-07-23", confidence: "high" as const, reasoning: "Historical pattern shows 34% spike in vehicle theft on weekends near tech parks. Current month trend + recurring MO detected." },
  { id: 2, location: "Koramangala 5th Block", district: "Bengaluru Urban", crimeType: "Cybercrime", probability: 0.81, predictedDate: "2025-07-21", confidence: "high" as const, reasoning: "Festival season correlates with 58% increase in UPI fraud attempts. 3 similar incidents in past 2 weeks." },
  { id: 3, location: "Mysuru Palace Road", district: "Mysuru", crimeType: "Chain Snatching", probability: 0.74, predictedDate: "2025-07-22", confidence: "medium" as const, reasoning: "Tourist season spike detected. Same MO used in 12 prior incidents. Suspect last seen in the area." },
  { id: 4, location: "Kalaburagi Bus Stand", district: "Kalaburagi", crimeType: "Pickpocketing", probability: 0.69, predictedDate: "2025-07-24", confidence: "medium" as const, reasoning: "Crowded venue + past incident patterns. Two repeat offenders known to operate in this area." },
  { id: 5, location: "Hubballi Old Town", district: "Dharwad", crimeType: "Burglary", probability: 0.58, predictedDate: "2025-07-25", confidence: "medium" as const, reasoning: "Increase in vacant properties during festival migration. Similar burglary wave observed in 2023." },
  { id: 6, location: "Mangaluru Beach Road", district: "Dakshina Kannada", crimeType: "Robbery", probability: 0.45, predictedDate: "2025-07-26", confidence: "low" as const, reasoning: "Low lighting conditions on beach road. 2 incidents last month at same time-of-day pattern." },
];

const RISK_AREAS = [
  { id: 1, area: "Electronic City", district: "Bengaluru Urban", riskScore: 91, primaryThreat: "Vehicle Theft", recommendedPatrolFrequency: "Every 2 hours", latitude: 12.8399, longitude: 77.6770 },
  { id: 2, area: "Koramangala", district: "Bengaluru Urban", riskScore: 88, primaryThreat: "Cybercrime / Fraud", recommendedPatrolFrequency: "Every 3 hours", latitude: 12.9352, longitude: 77.6245 },
  { id: 3, area: "Palace Road, Mysuru", district: "Mysuru", riskScore: 72, primaryThreat: "Chain Snatching", recommendedPatrolFrequency: "Every 4 hours", latitude: 12.3021, longitude: 76.6551 },
  { id: 4, area: "Kalaburagi Bus Stand", district: "Kalaburagi", riskScore: 64, primaryThreat: "Pickpocketing", recommendedPatrolFrequency: "Every 6 hours", latitude: 17.3297, longitude: 76.8168 },
  { id: 5, area: "Hubballi Old Town", district: "Dharwad", riskScore: 57, primaryThreat: "Burglary", recommendedPatrolFrequency: "Twice daily", latitude: 15.3647, longitude: 75.1240 },
];

router.get("/forecasting/predictions", async (req, res): Promise<void> => {
  res.json(GetCrimePredictionsResponse.parse(PREDICTIONS));
});

router.get("/forecasting/risk-areas", async (req, res): Promise<void> => {
  res.json(GetRiskAreasResponse.parse(RISK_AREAS));
});

export default router;
