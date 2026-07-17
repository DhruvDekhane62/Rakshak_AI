import { Router, type IRouter } from "express";
import { GetHotspotsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const STATIC_HOTSPOTS = [
  { id: 1, latitude: 12.9716, longitude: 77.5946, location: "Koramangala", district: "Bengaluru Urban", intensity: 0.92, crimeCount: 89, dominantCrimeType: "Cybercrime", riskLevel: "critical" as const },
  { id: 2, latitude: 12.8399, longitude: 77.6770, location: "Electronic City", district: "Bengaluru Urban", intensity: 0.78, crimeCount: 67, dominantCrimeType: "Vehicle Theft", riskLevel: "high" as const },
  { id: 3, latitude: 13.0827, longitude: 80.2707, location: "Kalaburagi Central", district: "Kalaburagi", intensity: 0.65, crimeCount: 54, dominantCrimeType: "Property Crime", riskLevel: "high" as const },
  { id: 4, latitude: 12.2958, longitude: 76.6394, location: "Mysuru City Centre", district: "Mysuru", intensity: 0.55, crimeCount: 48, dominantCrimeType: "Chain Snatching", riskLevel: "medium" as const },
  { id: 5, latitude: 15.3647, longitude: 75.1240, location: "Hubballi Industrial", district: "Dharwad", intensity: 0.48, crimeCount: 41, dominantCrimeType: "Burglary", riskLevel: "medium" as const },
  { id: 6, latitude: 12.9141, longitude: 74.8560, location: "Mangaluru Port", district: "Dakshina Kannada", intensity: 0.35, crimeCount: 29, dominantCrimeType: "Smuggling", riskLevel: "medium" as const },
  { id: 7, latitude: 15.8497, longitude: 74.4977, location: "Belagavi Market", district: "Belagavi", intensity: 0.28, crimeCount: 22, dominantCrimeType: "Fraud", riskLevel: "low" as const },
  { id: 8, latitude: 14.4426, longitude: 75.9197, location: "Shivamogga Town", district: "Shivamogga", intensity: 0.22, crimeCount: 18, dominantCrimeType: "Assault", riskLevel: "low" as const },
];

router.get("/hotspots", async (req, res): Promise<void> => {
  const { crimeType } = req.query;
  let hotspots = STATIC_HOTSPOTS;
  if (crimeType && typeof crimeType === "string") {
    hotspots = hotspots.filter((h) => h.dominantCrimeType.toLowerCase().includes(crimeType.toLowerCase()));
  }
  res.json(GetHotspotsResponse.parse(hotspots));
});

export default router;
