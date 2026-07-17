import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { 
  districts, units, ranks, designations, caseCategories, 
  gravityOffences, crimeHeads, crimeSubHeads, caseStatusMasters, 
  courts, occupationMasters, religionMasters, casteMasters, 
  acts, sections, states 
} from "./masters";

export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  districtId: integer("district_id").references(() => districts.id),
  unitId: integer("unit_id").references(() => units.id),
  rankId: integer("rank_id").references(() => ranks.id),
  designationId: integer("designation_id").references(() => designations.id),
  kgid: text("kgid"),
  firstName: text("first_name"),
  employeeDob: text("employee_dob"), // dates as text
  genderId: integer("gender_id"),
  bloodGroupId: integer("blood_group_id"),
  physicallyChallenged: integer("physically_challenged", { mode: "boolean" }),
  appointmentDate: text("appointment_date"),
});

export const caseMasters = sqliteTable("case_masters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  crimeNo: text("crime_no"),
  caseNo: text("case_no"),
  crimeRegisteredDate: integer("crime_registered_date", { mode: "timestamp_ms" }),
  policePersonId: integer("police_person_id").references(() => employees.id),
  policeStationId: integer("police_station_id").references(() => units.id),
  caseCategoryId: integer("case_category_id").references(() => caseCategories.id),
  gravityOffenceId: integer("gravity_offence_id").references(() => gravityOffences.id),
  crimeMajorHeadId: integer("crime_major_head_id").references(() => crimeHeads.id),
  crimeMinorHeadId: integer("crime_minor_head_id").references(() => crimeSubHeads.id),
  caseStatusId: integer("case_status_id").references(() => caseStatusMasters.id),
  courtId: integer("court_id").references(() => courts.id),
  
  incidentFromDate: integer("incident_from_date", { mode: "timestamp_ms" }),
  incidentToDate: integer("incident_to_date", { mode: "timestamp_ms" }),
  infoReceivedPsDate: integer("info_received_ps_date", { mode: "timestamp_ms" }),
  latitude: real("latitude"),
  longitude: real("longitude"),
  briefFacts: text("brief_facts"),
});

export const complainants = sqliteTable("complainant_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  complainantName: text("complainant_name"),
  ageYear: integer("age_year"),
  occupationId: integer("occupation_id").references(() => occupationMasters.id),
  religionId: integer("religion_id").references(() => religionMasters.id),
  casteId: integer("caste_id").references(() => casteMasters.id),
  genderId: integer("gender_id"),
});

export const actSectionAssociations = sqliteTable("act_section_associations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  actCode: text("act_code").references(() => acts.actCode),
  sectionId: text("section_id"), 
  actOrderId: integer("act_order_id"),
  sectionOrderId: integer("section_order_id"),
});

export const victims = sqliteTable("victims", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  victimName: text("victim_name"),
  ageYear: integer("age_year"),
  genderId: integer("gender_id"),
  victimPolice: text("victim_police"),
});

export const accused = sqliteTable("accused", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  accusedName: text("accused_name"),
  ageYear: integer("age_year"),
  genderId: integer("gender_id"),
  personId: text("person_id"),
});

export const arrestSurrenders = sqliteTable("arrest_surrenders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  arrestSurrenderTypeId: integer("arrest_surrender_type_id"),
  arrestSurrenderDate: text("arrest_surrender_date"),
  arrestSurrenderStateId: integer("arrest_surrender_state_id").references(() => states.id),
  arrestSurrenderDistrictId: integer("arrest_surrender_district_id").references(() => districts.id),
  policeStationId: integer("police_station_id").references(() => units.id),
  ioId: integer("io_id").references(() => employees.id),
  courtId: integer("court_id").references(() => courts.id),
  accusedMasterId: integer("accused_master_id").references(() => accused.id),
  isAccused: integer("is_accused", { mode: "boolean" }),
  isComplainantAccused: integer("is_complainant_accused", { mode: "boolean" }),
});

export const chargesheets = sqliteTable("chargesheet_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseMasterId: integer("case_master_id").references(() => caseMasters.id),
  csDate: integer("cs_date", { mode: "timestamp_ms" }),
  csType: text("cs_type"), 
  policePersonId: integer("police_person_id").references(() => employees.id),
});
