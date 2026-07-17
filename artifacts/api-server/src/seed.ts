import { db } from "@workspace/db";
import { 
  districts, units, ranks, designations, caseCategories, 
  gravityOffences, crimeHeads, crimeSubHeads, caseStatusMasters, 
  courts, occupationMasters, religionMasters, casteMasters, 
  acts, sections, states, employees, caseMasters, complainants,
  victims, accused, arrestSurrenders, chargesheets, alertsTable,
  actSectionAssociations
} from "@workspace/db";

function generateCrimeAndCaseNo(categoryCode: number, districtId: number, unitId: number, year: number, serial: number) {
  const catStr = String(categoryCode);
  const distStr = String(districtId).padStart(4, "0");
  const unitStr = String(unitId).padStart(4, "0");
  const yearStr = String(year);
  const serialStr = String(serial).padStart(5, "0");
  
  const crimeNo = `${catStr}${distStr}${unitStr}${yearStr}${serialStr}`;
  const caseNo = `${yearStr}${serialStr}`;
  
  return { crimeNo, caseNo };
}

async function main() {
  console.log("Cleaning existing data...");
  // Clear existing data to avoid unique/primary key conflicts when re-running seed
  await db.delete(alertsTable);
  await db.delete(actSectionAssociations);
  await db.delete(chargesheets);
  await db.delete(arrestSurrenders);
  await db.delete(accused);
  await db.delete(complainants);
  await db.delete(victims);
  await db.delete(caseMasters);
  await db.delete(employees);
  await db.delete(sections);
  await db.delete(acts);
  await db.delete(courts);
  await db.delete(units);
  await db.delete(crimeSubHeads);
  await db.delete(crimeHeads);
  await db.delete(districts);
  await db.delete(states);
  await db.delete(ranks);
  await db.delete(designations);
  await db.delete(caseCategories);
  await db.delete(gravityOffences);
  await db.delete(caseStatusMasters);
  await db.delete(occupationMasters);
  await db.delete(religionMasters);
  await db.delete(casteMasters);

  console.log("Seeding Database with exact ER Diagram specifications...");

  // 1. Seed States & Districts
  const [state] = await db.insert(states).values({ id: 29, stateName: "Karnataka" }).returning();
  
  const [bengaluru] = await db.insert(districts).values({ id: 443, districtName: "Bengaluru Urban", stateId: state.id }).returning();
  const [mysuru] = await db.insert(districts).values({ id: 444, districtName: "Mysuru", stateId: state.id }).returning();
  const [kalaburagi] = await db.insert(districts).values({ id: 446, districtName: "Kalaburagi", stateId: state.id }).returning();
  const [dharwad] = await db.insert(districts).values({ id: 445, districtName: "Dharwad", stateId: state.id }).returning();
  const [shivamogga] = await db.insert(districts).values({ id: 447, districtName: "Shivamogga", stateId: state.id }).returning();

  // 2. Seed Units (Police Stations)
  const [unit1] = await db.insert(units).values({ id: 6, unitName: "Koramangala PS", stateId: state.id, districtId: bengaluru.id }).returning();
  const [unit2] = await db.insert(units).values({ id: 7, unitName: "Indiranagar PS", stateId: state.id, districtId: bengaluru.id }).returning();
  const [unit3] = await db.insert(units).values({ id: 8, unitName: "Mysuru Town PS", stateId: state.id, districtId: mysuru.id }).returning();
  const [unit4] = await db.insert(units).values({ id: 10, unitName: "Kalaburagi Central PS", stateId: state.id, districtId: kalaburagi.id }).returning();
  const [unit5] = await db.insert(units).values({ id: 9, unitName: "Hubballi PS", stateId: state.id, districtId: dharwad.id }).returning();
  const [unit6] = await db.insert(units).values({ id: 11, unitName: "Shivamogga PS", stateId: state.id, districtId: shivamogga.id }).returning();

  // 3. Seed Courts
  const [court1] = await db.insert(courts).values({ courtName: "1st ACMM Bengaluru", stateId: state.id, districtId: bengaluru.id }).returning();
  const [court2] = await db.insert(courts).values({ courtName: "Principal District Court Mysuru", stateId: state.id, districtId: mysuru.id }).returning();
  const [court3] = await db.insert(courts).values({ courtName: "Fast Track Court Kalaburagi", stateId: state.id, districtId: kalaburagi.id }).returning();

  // 4. Seed Ranks & Designations
  const [rankConstable] = await db.insert(ranks).values({ rankName: "Constable", hierarchy: 5 }).returning();
  const [rankInspector] = await db.insert(ranks).values({ rankName: "Inspector", hierarchy: 2 }).returning();
  const [rankDSP] = await db.insert(ranks).values({ rankName: "DSP", hierarchy: 1 }).returning();

  const [desigIO] = await db.insert(designations).values({ designationName: "Investigating Officer" }).returning();
  const [desigSHO] = await db.insert(designations).values({ designationName: "SHO" }).returning();

  // 5. Seed Case Categories (FIR=1, UDR=3, PAR=4, Zero FIR=8)
  const [catFir] = await db.insert(caseCategories).values({ id: 1, lookupValue: "FIR" }).returning();
  const [catUdr] = await db.insert(caseCategories).values({ id: 3, lookupValue: "UDR" }).returning();
  const [catPar] = await db.insert(caseCategories).values({ id: 4, lookupValue: "PAR" }).returning();
  const [catZero] = await db.insert(caseCategories).values({ id: 8, lookupValue: "Zero FIR" }).returning();

  // 6. Seed Gravity Offences
  const [gravHeinous] = await db.insert(gravityOffences).values({ lookupValue: "Heinous" }).returning();
  const [gravNonHeinous] = await db.insert(gravityOffences).values({ lookupValue: "Non-Heinous" }).returning();
  
  // 7. Seed Crime Heads & Sub-Heads
  const [chBurglary] = await db.insert(crimeHeads).values({ crimeGroupName: "Burglary" }).returning();
  const [chCyber] = await db.insert(crimeHeads).values({ crimeGroupName: "Cybercrime" }).returning();
  const [chMurder] = await db.insert(crimeHeads).values({ crimeGroupName: "Murder" }).returning();
  const [chRobbery] = await db.insert(crimeHeads).values({ crimeGroupName: "Robbery" }).returning();
  const [chVehicle] = await db.insert(crimeHeads).values({ crimeGroupName: "Vehicle Theft" }).returning();
  const [chAssault] = await db.insert(crimeHeads).values({ crimeGroupName: "Assault" }).returning();

  const [cshHousebreaking] = await db.insert(crimeSubHeads).values({ crimeHeadId: chBurglary.id, crimeHeadName: "House Breaking by Day", seqId: 1 }).returning();
  const [cshUPIFraud] = await db.insert(crimeSubHeads).values({ crimeHeadId: chCyber.id, crimeHeadName: "UPI QR Code Fraud", seqId: 2 }).returning();
  const [cshHomicide] = await db.insert(crimeSubHeads).values({ crimeHeadId: chMurder.id, crimeHeadName: "Murder for Gain", seqId: 3 }).returning();

  // 8. Seed Case Statuses
  const [csInvestigating] = await db.insert(caseStatusMasters).values({ caseStatusName: "Under Investigation" }).returning();
  const [csChargesheeted] = await db.insert(caseStatusMasters).values({ caseStatusName: "Charge Sheeted" }).returning();
  const [csClosed] = await db.insert(caseStatusMasters).values({ caseStatusName: "Closed" }).returning();

  // 9. Seed Personal Masters
  const [occEngineer] = await db.insert(occupationMasters).values({ occupationName: "Software Engineer" }).returning();
  const [occFarmer] = await db.insert(occupationMasters).values({ occupationName: "Farmer" }).returning();
  const [occGov] = await db.insert(occupationMasters).values({ occupationName: "Government Employee" }).returning();
  
  const [relHindu] = await db.insert(religionMasters).values({ religionName: "Hindu" }).returning();
  const [relMuslim] = await db.insert(religionMasters).values({ religionName: "Muslim" }).returning();
  const [relChristian] = await db.insert(religionMasters).values({ religionName: "Christian" }).returning();
  
  const [cstGen] = await db.insert(casteMasters).values({ casteMasterName: "General" }).returning();

  // 10. Seed Acts & Sections
  await db.insert(acts).values([
    { actCode: "IPC", actDescription: "Indian Penal Code 1860", shortName: "IPC", active: true },
    { actCode: "IT", actDescription: "Information Technology Act 2000", shortName: "IT Act", active: true },
    { actCode: "NDPS", actDescription: "Narcotic Drugs and Psychotropic Substances Act 1985", shortName: "NDPS Act", active: true }
  ]);

  const [sec302] = await db.insert(sections).values({ actCode: "IPC", sectionCode: "302", sectionDescription: "Punishment for Murder", active: true }).returning();
  const [sec379] = await db.insert(sections).values({ actCode: "IPC", sectionCode: "379", sectionDescription: "Punishment for Theft", active: true }).returning();
  const [sec395] = await db.insert(sections).values({ actCode: "IPC", sectionCode: "395", sectionDescription: "Punishment for Dacoity", active: true }).returning();
  const [sec420] = await db.insert(sections).values({ actCode: "IPC", sectionCode: "420", sectionDescription: "Cheating and dishonestly inducing delivery of property", active: true }).returning();
  const [sec66D] = await db.insert(sections).values({ actCode: "IT", sectionCode: "66D", sectionDescription: "Punishment for cheating by personation by using computer resource", active: true }).returning();

  // 11. Seed Employees
  const [emp1] = await db.insert(employees).values({
    firstName: "Rajesh Kumar",
    districtId: bengaluru.id,
    unitId: unit1.id,
    rankId: rankInspector.id,
    designationId: desigSHO.id,
    kgid: "KGID99881",
    employeeDob: "1980-05-15",
    genderId: 1,
  }).returning();

  const [emp2] = await db.insert(employees).values({
    firstName: "Vikram Patil",
    districtId: mysuru.id,
    unitId: unit3.id,
    rankId: rankInspector.id,
    designationId: desigIO.id,
    kgid: "KGID44552",
    employeeDob: "1983-08-22",
    genderId: 1,
  }).returning();

  // 12. Seed Core Entities & Cases
  // Case 1: Burglary FIR (104430006202600001)
  const numbers1 = generateCrimeAndCaseNo(1, bengaluru.id, unit1.id, 2026, 1);
  const [case1] = await db.insert(caseMasters).values({
    crimeNo: numbers1.crimeNo,
    caseNo: numbers1.caseNo,
    policeStationId: unit1.id,
    courtId: court1.id,
    policePersonId: emp1.id,
    caseCategoryId: catFir.id,
    gravityOffenceId: gravNonHeinous.id,
    crimeMajorHeadId: chBurglary.id,
    crimeMinorHeadId: cshHousebreaking.id,
    caseStatusId: csInvestigating.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 2),
    incidentFromDate: new Date(Date.now() - 86400000 * 3),
    latitude: 12.9352,
    longitude: 77.6245,
    briefFacts: "House break-in reported at 3rd Block, Koramangala. Cash and jewelry stolen.",
  }).returning();

  await db.insert(actSectionAssociations).values({
    caseMasterId: case1.id,
    actCode: "IPC",
    sectionId: "379",
    actOrderId: 1,
    sectionOrderId: 1,
  });

  await db.insert(complainants).values({
    caseMasterId: case1.id,
    complainantName: "Amit Sharma",
    ageYear: 34,
    occupationId: occEngineer.id,
    religionId: relHindu.id,
    casteId: cstGen.id,
    genderId: 1,
  });

  const [acc1] = await db.insert(accused).values({
    caseMasterId: case1.id,
    accusedName: "Ramesh Babu",
    ageYear: 28,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case1.id,
    accusedMasterId: acc1.id,
    policeStationId: unit1.id,
    courtId: court1.id,
    isAccused: true,
  });

  // Case 2: Cybercrime FIR (104430007202600002)
  const numbers2 = generateCrimeAndCaseNo(1, bengaluru.id, unit2.id, 2026, 2);
  const [case2] = await db.insert(caseMasters).values({
    crimeNo: numbers2.crimeNo,
    caseNo: numbers2.caseNo,
    policeStationId: unit2.id,
    courtId: court1.id,
    policePersonId: emp1.id,
    caseCategoryId: catFir.id,
    gravityOffenceId: gravNonHeinous.id,
    crimeMajorHeadId: chCyber.id,
    crimeMinorHeadId: cshUPIFraud.id,
    caseStatusId: csInvestigating.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 4),
    incidentFromDate: new Date(Date.now() - 86400000 * 5),
    latitude: 12.9784,
    longitude: 77.6408,
    briefFacts: "Victim received a fake call regarding KYC update and lost Rs. 50,000.",
  }).returning();

  await db.insert(actSectionAssociations).values({
    caseMasterId: case2.id,
    actCode: "IT",
    sectionId: "66D",
    actOrderId: 1,
    sectionOrderId: 1,
  });

  await db.insert(complainants).values({
    caseMasterId: case2.id,
    complainantName: "Priya Reddy",
    ageYear: 26,
    occupationId: occEngineer.id,
    religionId: relHindu.id,
    casteId: cstGen.id,
    genderId: 2,
  });

  const [acc2] = await db.insert(accused).values({
    caseMasterId: case2.id,
    accusedName: "Kiran Kumar",
    ageYear: 31,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case2.id,
    accusedMasterId: acc2.id,
    policeStationId: unit2.id,
    courtId: court1.id,
    isAccused: true,
  });

  // Case 3: Murder FIR (104440008202600003)
  const numbers3 = generateCrimeAndCaseNo(1, mysuru.id, unit3.id, 2026, 3);
  const [case3] = await db.insert(caseMasters).values({
    crimeNo: numbers3.crimeNo,
    caseNo: numbers3.caseNo,
    policeStationId: unit3.id,
    courtId: court2.id,
    policePersonId: emp2.id,
    caseCategoryId: catFir.id,
    gravityOffenceId: gravHeinous.id,
    crimeMajorHeadId: chMurder.id,
    crimeMinorHeadId: cshHomicide.id,
    caseStatusId: csChargesheeted.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 10),
    incidentFromDate: new Date(Date.now() - 86400000 * 11),
    latitude: 12.3021,
    longitude: 76.6551,
    briefFacts: "Murder reported near Mysuru Palace Road over property dispute.",
  }).returning();

  await db.insert(actSectionAssociations).values({
    caseMasterId: case3.id,
    actCode: "IPC",
    sectionId: "302",
    actOrderId: 1,
    sectionOrderId: 1,
  });

  await db.insert(complainants).values({
    caseMasterId: case3.id,
    complainantName: "Mahesh Sen",
    ageYear: 45,
    occupationId: occFarmer.id,
    religionId: relHindu.id,
    casteId: cstGen.id,
    genderId: 1,
  });

  await db.insert(victims).values({
    caseMasterId: case3.id,
    victimName: "Vikram Sen",
    ageYear: 42,
    genderId: 1,
    victimPolice: "0",
  });

  const [acc3] = await db.insert(accused).values({
    caseMasterId: case3.id,
    accusedName: "Suresh Gowda",
    ageYear: 39,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case3.id,
    accusedMasterId: acc3.id,
    policeStationId: unit3.id,
    courtId: court2.id,
    isAccused: true,
  });

  // Case 4: Robbery FIR (104460010202600004)
  const numbers4 = generateCrimeAndCaseNo(1, kalaburagi.id, unit4.id, 2026, 4);
  const [case4] = await db.insert(caseMasters).values({
    crimeNo: numbers4.crimeNo,
    caseNo: numbers4.caseNo,
    policeStationId: unit4.id,
    courtId: court3.id,
    policePersonId: emp2.id,
    caseCategoryId: catFir.id,
    gravityOffenceId: gravHeinous.id,
    crimeMajorHeadId: chRobbery.id,
    caseStatusId: csInvestigating.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 6),
    incidentFromDate: new Date(Date.now() - 86400000 * 6),
    latitude: 17.3297,
    longitude: 76.8168,
    briefFacts: "Snatching of gold chain from pedestrian near Kalaburagi Central.",
  }).returning();

  await db.insert(actSectionAssociations).values({
    caseMasterId: case4.id,
    actCode: "IPC",
    sectionId: "395",
    actOrderId: 1,
    sectionOrderId: 1,
  });

  await db.insert(complainants).values({
    caseMasterId: case4.id,
    complainantName: "Lakshmi Prasad",
    ageYear: 58,
    occupationId: occFarmer.id,
    religionId: relHindu.id,
    casteId: cstGen.id,
    genderId: 2,
  });

  const [acc4] = await db.insert(accused).values({
    caseMasterId: case4.id,
    accusedName: "Anil Naik",
    ageYear: 26,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case4.id,
    accusedMasterId: acc4.id,
    policeStationId: unit4.id,
    courtId: court3.id,
    isAccused: true,
  });

  // Case 5: UDR - Unnatural Death Report (304430006202600001)
  const numbers5 = generateCrimeAndCaseNo(3, bengaluru.id, unit1.id, 2026, 1);
  const [case5] = await db.insert(caseMasters).values({
    crimeNo: numbers5.crimeNo,
    caseNo: numbers5.caseNo,
    policeStationId: unit1.id,
    courtId: court1.id,
    policePersonId: emp1.id,
    caseCategoryId: catUdr.id,
    gravityOffenceId: gravNonHeinous.id,
    crimeMajorHeadId: chAssault.id,
    caseStatusId: csClosed.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 8),
    incidentFromDate: new Date(Date.now() - 86400000 * 9),
    latitude: 12.9141,
    longitude: 74.8560,
    briefFacts: "Unnatural death report registered for a body retrieved from a lake.",
  }).returning();

  const [acc5] = await db.insert(accused).values({
    caseMasterId: case5.id,
    accusedName: "Jagadish Prasad",
    ageYear: 33,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case5.id,
    accusedMasterId: acc5.id,
    policeStationId: unit5.id,
    courtId: court1.id,
    isAccused: true,
  });

  // Case 6: Zero FIR (804430006202600001)
  const numbers6 = generateCrimeAndCaseNo(8, bengaluru.id, unit1.id, 2026, 1);
  const [case6] = await db.insert(caseMasters).values({
    crimeNo: numbers6.crimeNo,
    caseNo: numbers6.caseNo,
    policeStationId: unit1.id,
    courtId: court1.id,
    policePersonId: emp1.id,
    caseCategoryId: catZero.id,
    gravityOffenceId: gravNonHeinous.id,
    crimeMajorHeadId: chVehicle.id,
    caseStatusId: csInvestigating.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 1),
    incidentFromDate: new Date(Date.now() - 86400000 * 1),
    latitude: 14.4426,
    longitude: 75.9197,
    briefFacts: "Zero FIR registered for vehicle theft occurring in Mysuru jurisdiction, forwarded.",
  }).returning();

  const [acc6] = await db.insert(accused).values({
    caseMasterId: case6.id,
    accusedName: "Suresh Gowda", // same name to establish link
    ageYear: 39,
    genderId: 1,
    personId: "A1",
  }).returning();

  await db.insert(arrestSurrenders).values({
    caseMasterId: case6.id,
    accusedMasterId: acc6.id,
    policeStationId: unit6.id,
    courtId: court1.id,
    isAccused: true,
  });

  // Case 7: PAR (404430006202600001)
  const numbers7 = generateCrimeAndCaseNo(4, bengaluru.id, unit1.id, 2026, 1);
  const [case7] = await db.insert(caseMasters).values({
    crimeNo: numbers7.crimeNo,
    caseNo: numbers7.caseNo,
    policeStationId: unit1.id,
    courtId: court1.id,
    policePersonId: emp1.id,
    caseCategoryId: catPar.id,
    gravityOffenceId: gravNonHeinous.id,
    crimeMajorHeadId: chAssault.id,
    caseStatusId: csInvestigating.id,
    crimeRegisteredDate: new Date(Date.now() - 86400000 * 5),
    incidentFromDate: new Date(Date.now() - 86400000 * 5),
    latitude: 15.8497,
    longitude: 74.4977,
    briefFacts: "Petty Case registered for minor altercation in Belagavi market square.",
  }).returning();

  // 13. Seed Alerts
  await db.insert(alertsTable).values([
    {
      type: "gang_activity",
      title: "Active Gang Network Detected",
      description: "Relay theft pattern identified matching gang signatures across Electronic City.",
      severity: "critical",
      location: "Electronic City, Bengaluru",
      isRead: false,
      relatedFirIds: [case1.id.toString(), case5.id.toString()],
      createdAt: new Date(),
    },
    {
      type: "repeat_offender",
      title: "Repeat Offender Flagged",
      description: "Habitual offender Suresh Gowda linked to multiple cases (Murder & Assault).",
      severity: "high",
      location: "Mysuru / Shivamogga",
      isRead: false,
      relatedFirIds: [case3.id.toString(), case6.id.toString()],
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      type: "crime_spike",
      title: "Cybercrime Spike Alert",
      description: "60% increase in UPI vishing attacks observed in Bengaluru Urban last 48 hours.",
      severity: "high",
      location: "Bengaluru Urban",
      isRead: false,
      relatedFirIds: [case2.id.toString()],
      createdAt: new Date(Date.now() - 7200000),
    }
  ]);

  console.log("Seeding Complete!");
}

main().catch(console.error);
