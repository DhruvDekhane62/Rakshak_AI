import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const alertsTable = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["repeat_offender", "gang_activity", "crime_spike", "same_weapon", "serial_pattern"] }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity", { enum: ["low", "medium", "high", "critical"] }).notNull(),
  location: text("location").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  relatedFirIds: text("related_fir_ids", { mode: "json" }).notNull().$type<string[]>(), // Mock array
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, createdAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
