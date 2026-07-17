import { db } from "../lib/db/src/index.ts";
import { accused } from "../lib/db/src/index.ts";

try {
  const rows = await db.select().from(accused);
  console.log("Accused table content:", rows);
} catch (err) {
  console.error("Query failed:", err);
}
