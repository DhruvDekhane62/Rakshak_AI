import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Common fields
const activeField = integer("active", { mode: "boolean" }).default(true).notNull();

export const states = sqliteTable("states", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stateName: text("state_name").notNull(),
  nationalityId: integer("nationality_id"),
  active: activeField,
});

export const districts = sqliteTable("districts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  districtName: text("district_name").notNull(),
  stateId: integer("state_id").references(() => states.id),
  active: activeField,
});

export const unitTypes = sqliteTable("unit_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unitTypeName: text("unit_type_name").notNull(),
  cityDistState: text("city_dist_state"),
  hierarchy: integer("hierarchy"),
  active: activeField,
});

export const units = sqliteTable("units", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unitName: text("unit_name").notNull(),
  typeId: integer("type_id").references(() => unitTypes.id),
  parentUnit: integer("parent_unit"), // self reference
  nationalityId: integer("nationality_id"),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  active: activeField,
});

export const ranks = sqliteTable("ranks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rankName: text("rank_name").notNull(),
  hierarchy: integer("hierarchy"),
  active: activeField,
});

export const designations = sqliteTable("designations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  designationName: text("designation_name").notNull(),
  sortOrder: integer("sort_order"),
  active: activeField,
});

export const courts = sqliteTable("courts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courtName: text("court_name").notNull(),
  districtId: integer("district_id").references(() => districts.id),
  stateId: integer("state_id").references(() => states.id),
  active: activeField,
});

export const caseCategories = sqliteTable("case_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lookupValue: text("lookup_value").notNull(),
});

export const gravityOffences = sqliteTable("gravity_offences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lookupValue: text("lookup_value").notNull(),
});

export const crimeHeads = sqliteTable("crime_heads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  crimeGroupName: text("crime_group_name").notNull(),
  active: activeField,
});

export const crimeSubHeads = sqliteTable("crime_sub_heads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  crimeHeadId: integer("crime_head_id").references(() => crimeHeads.id),
  crimeHeadName: text("crime_head_name").notNull(),
  seqId: integer("seq_id"),
});

export const acts = sqliteTable("acts", {
  actCode: text("act_code").primaryKey(), // ActCode
  actDescription: text("act_description").notNull(),
  shortName: text("short_name"),
  active: activeField,
});

export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actCode: text("act_code").references(() => acts.actCode),
  sectionCode: text("section_code").notNull(),
  sectionDescription: text("section_description"),
  active: activeField,
});

export const casteMasters = sqliteTable("caste_masters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  casteMasterName: text("caste_master_name").notNull(),
});

export const religionMasters = sqliteTable("religion_masters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  religionName: text("religion_name").notNull(),
});

export const occupationMasters = sqliteTable("occupation_masters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  occupationName: text("occupation_name").notNull(),
});

export const caseStatusMasters = sqliteTable("case_status_masters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseStatusName: text("case_status_name").notNull(),
});

export const crimeHeadActSections = sqliteTable("crime_head_act_sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  crimeHeadId: integer("crime_head_id").references(() => crimeHeads.id),
  actCode: text("act_code").references(() => acts.actCode),
  sectionCode: text("section_code"),
});
