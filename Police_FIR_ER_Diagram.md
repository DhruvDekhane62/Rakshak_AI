Police FIR System — ER Diagram 

# **DB schema** 

Entity Relationship Diagram — Database Design Document Karnataka Police Department 

### **Color Legend** 

|**PK — Primary Key**|Uniquely identifies each record in the table|
|---|---|
|**FK — Foreign Key**|References the Primary Key of another table|
|**Alternate row**|Alternating row shading for readability|
|**Normal column**|Regular data column with no key constraint|



## **Table Definitions** 

#### **CaseMaster** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CaseMasterID**|INT|**PK**|Primarykey— unique identifier for each FIR/case|
||||Crime Number is assigned at the police station level and is<br>linked to the corresponding PoliceStationID. The Crime<br>Number follows a structured format consisting of:<br>1 digit Case Category Code + 4 digit District ID + 4 digit<br>Police Station ID (Unit ID) + 4 digit Year + 5 digit Running<br>Serial Number|
|CrimeNo|VARCHAR||A separate running serial number is maintained for each<br>police station, case category, and year.<br>Examples:<br><br>FIR: 104430006202600001<br><br>UDR: 304430006202600001<br><br>Zero FIR: 804430006202600001<br><br>PAR: 404430006202600001|
|CaseNo|VARCHAR||The**Case Number**is generated at the police station level and<br>is associated with the corresponding**PoliceStationID**. For<br>each case category, a unique serial number is maintained per<br>police station and per year. The format is**YYYY + 5-digit**<br>**running serial number**(e.g.,**202600001**).(Last 9 digits<br>from CrimeNo)|
|CrimeRegisteredDate|DATE||Date when the FIR was registered|
|PolicePersonID|INT|**FK**|FK → Employee.EmployeeID — officer who registered the FIR|
|PoliceStationID|INT|**FK**|FK → Unit.UnitID —police station where FIR is registered|
|CaseCategoryID|INT|**FK**|FK → CaseCategory.CaseCategoryID — category|
|GravityOffenceID|INT|**FK**|FK → GravityOffence.GravityOffenceID — gravity level of the<br>offence|
|CrimeMajorHeadID|INT|**FK**|FK → CrimeHead.CrimeHeadID — major crime head<br>classification|
|CrimeMinorHeadID|INT|**FK**|FK → CrimeSubHead.CrimeSubHeadID — minor crime sub-head<br>classification|
|CaseStatusID|INT|**FK**|FK → CaseStatusMaster.CaseStatusID — current status of the<br>case|
|CourtID|INT|**FK**|FK → Court.CourtID — court where the case is beingheard|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|IncidentFromDate|DATETIME||Start date and time of the incident|
|IncidentToDate|DATETIME||End date and time of the incident|
|InfoReceivedPSDate|DATETIME||Date and time when police station received information about the<br>incident|
|latitude|DECIMAL||GPS latitude coordinate of the incident location|
|longitude|DECIMAL||GPS longitude coordinate of the incident location|
|BriefFacts|Nvarchar(Max)||Summary of the case|



#### **ComplainantDetails** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**ComplainantID**|INT|**PK**|Primarykey— unique identifier for the complainant|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case filed by this<br>complainant|
|ComplainantName|VARCHAR||Full name of the complainant|
|AgeYear|INT||Age of the complainant|
|OccupationID|INT|**FK**|FK → OccupationMaster.OccupationID — occupation of the<br>complainant|
|ReligionID|INT|**FK**|FK → ReligionMaster.ReligionID — religion of the complainant|
|CasteID|INT|**FK**|FK → CasteMaster.caste_master_id — caste of the complainant|
|GenderID|INT||Gender of the complainant (lookup value)|



#### **ActSectionAssociation** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case this act-section<br>applies to|
|ActID|INT|**FK**|FK → Act.ActCode — legal act under which charges are framed|
|SectionID|INT|**FK**|FK → Section.SectionCode — specific section of the act invoked|
|ActOrderID|INT||Display/print order of the act within the case|
|SectionOrderID|INT||Display/print order of the section under the act|



#### **Victim** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**VictimMasterID**|INT|**PK**|Primarykey— unique identifier for each victim|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case this victim belongs to|
|VictimName|VARCHAR||Full name of the victim|
|AgeYear|INT||Age of the victim in years|
|GenderID|INT||Gender of the victim (lookup value) like m, f, t|
|VictimPolice|VARCHAR||If Victim is police then 1else 0|



#### **Accused** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**AccusedMasterID**|INT|**PK**|Primarykey— unique identifier for each accusedperson|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case this accused is linked|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
||||to|
|AccusedName|VARCHAR||Full name of the accused|
|AgeYear|INT||Age of the accused|
|GenderID|INT||Gender of the accused mentioned as M/F/T|
|PersonID|VARCHAR||Accused Sorting like A1, A2, A3….|



#### **ArrestSurrender** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**ArrestSurrenderID**|INT|**PK**|Primarykey— unique identifier for each arrest/surrender event|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case linked to this<br>arrest/surrender|
|ArrestSurrenderTypeID|INT||Type of event: arrest or voluntary surrender (lookup value)|
|ArrestSurrenderDate|DATE||Date of arrest or surrender|
|ArrestSurrenderStateId|INT|**FK**|FK → State.StateID — state where arrest/surrender occurred|
|ArrestSurrenderDistrictId|INT|**FK**|FK → District.DistrictID — district where arrest/surrender occurred|
|PoliceStationID|INT|**FK**|FK → Unit.UnitID —police station handlingthe arrest|
|IOID|INT|**FK**|FK → Employee.EmployeeID — Investigating Officer who made the<br>arrest|
|CourtID|INT|**FK**|FK → Court.CourtID — court before which accused wasproduced|
|AccusedMasterID|INT|**FK**|FK → Accused.AccusedMasterID — accused person linked to this<br>arrest/surrender|
|IsAccused|BIT||Flag (0/1): whether the person is the primary accused in the case|
|IsComplainantAccused|BIT||Flag (0/1): whether the complainant is also listed as accused|



#### **Act** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**ActCode**|VARCHAR|**PK**|Primarykey— unique code for the legal act(e.g. IPC, NDPS)|
|ActDescription|VARCHAR||Full official name/description of the act|
|ShortName|VARCHAR||Abbreviated/common name of the act|
|Active|BIT||Whether the act is currently active and usable (1=Active, 0=Inactive)|



#### **Section** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|ActCode|VARCHAR|**FK**|FK → Act.ActCode —parent act this section belongs to|
|SectionCode|VARCHAR||Section number/code (e.g. 302, 307)|
|SectionDescription|VARCHAR||Full description of the section|
|Active|BIT||Whether the section is currently active (1=Active, 0=Inactive)|
|**CrimeHeadActS**<br>**Column Name**|**ection**<br>**Type**|**Key**|**Description**|
|CrimeHeadID|INT|**FK**|FK → CrimeHead.CrimeHeadID — crime head this act-section<br>combination maps to|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|ActCode|VARCHAR|**FK**|FK → Act.ActCode — legal act linked to this crime head|
|SectionCode|VARCHAR||Section code from the act applicable to this crime head|



#### **CrimeHead** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CrimeHeadID**|INT|**PK**|Primarykey— unique identifier for the major crime head|
|CrimeGroupName|VARCHAR||Name of the crime group/major head (e.g. Crimes Against Body)|
|Active|BIT||Whether this crime head is active (1=Active, 0=Inactive)|



#### **CrimeSubHead** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CrimeSubHeadID**|INT|**PK**|Primarykey— unique identifier for the crime sub-head|
|CrimeHeadID|INT|**FK**|FK → CrimeHead.CrimeHeadID — parent major crime head this<br>belongs to|
|CrimeHeadName|VARCHAR||Name of this crime sub-head (e.g. Murder, Robbery)|
|SeqID|INT||Display/sort sequence number for ordering sub-heads|



#### **CasteMaster** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**caste_master_id**|INT|**PK**|Primary key — unique identifier for each caste. Referenced by<br>ComplainantDetails.CasteID|
|caste_master_name|VARCHAR||Name of the caste|



#### **ReligionMaster** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**ReligionID**|INT|**PK**|Primary key — unique identifier for each religion. Referenced by<br>ComplainantDetails.ReligionID|
|ReligionName|VARCHAR||Name of the religion (e.g. Hindu, Muslim, Christian)|



#### **OccupationMaster** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**OccupationID**|INT|**PK**|Primary key — unique identifier for each occupation. Referenced by<br>ComplainantDetails.OccupationID|
|OccupationName|VARCHAR||Name of the occupation (e.g. Farmer, Government Employee)|



#### **CaseStatusMaster** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CaseStatusID**|INT|**PK**|Primary key — unique identifier for each case status. Referenced by<br>CaseMaster.CaseStatusID|
|CaseStatusName|VARCHAR||Name of the status (e.g. Under Investigation, Charge Sheeted,<br>Closed)|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

#### **Court** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CourtID**|INT|**PK**|Primary key — unique identifier for the court. Referenced by<br>CaseMaster.CourtID, ArrestSurrender.CourtID|
|CourtName|VARCHAR||Full name of the court|
|DistrictID|INT|**FK**|FK → District.DistrictID — district where the court is located|
|StateID|INT|**FK**|FK → State.StateID — state where the court is located|
|Active|BIT||Whether the court is active (1=Active, 0=Inactive)|



#### **District** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**DistrictID**|INT|**PK**|Primary key — unique identifier for the district. Referenced by Court,<br>Unit, Employee, ArrestSurrender|
|DistrictName|VARCHAR||Name of the district|
|StateID|INT|**FK**|FK → State.StateID — state this district belongs to|
|Active|BIT||Whether the district record is active (1=Active, 0=Inactive)|



#### **State** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**StateID**|INT|**PK**|Primary key — unique identifier for the state. Referenced by Court,<br>District, Unit, ArrestSurrender|
|StateName|VARCHAR||Name of the state|
|NationalityID|INT||Nationality reference ID|
|Active|BIT||Whether the state record is active (1=Active, 0=Inactive)|



#### **Unit** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**UnitID**|INT|**PK**|Primary key — unique identifier for the police unit. Referenced by<br>CaseMaster.PoliceStationID, Employee.UnitID,<br>ArrestSurrender.PoliceStationID|
|UnitName|VARCHAR||Name of the unit or police station|
|TypeID|INT|**FK**|FK → UnitType.UnitTypeID — type/categoryof the unit|
|ParentUnit|INT||Parent unit ID for hierarchy (self-reference to UnitID)|
|NationalityID|INT||Nationality reference ID|
|StateID|INT|**FK**|FK → State.StateID — state the unit belongs to|
|DistrictID|INT|**FK**|FK → District.DistrictID — district the unit belongs to|
|Active|BIT||Whether the unit is active (1=Active, 0=Inactive)|



#### **UnitType** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**UnitTypeID**|INT|**PK**|Primary key — unique identifier for the unit type. Referenced by<br>Unit.TypeID|
|UnitTypeName|VARCHAR||Name of the unit type (e.g. Police Station, Circle Office)|
|CityDistState|VARCHAR||Operational level: City / District / State|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|Hierarchy|INT||Hierarchy level number (lower = higher authority)|
|Active|BIT||Whether the unit type is active (1=Active, 0=Inactive)|



#### **Rank** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**RankID**|INT|**PK**|Primary key — unique identifier for the rank. Referenced by<br>Employee.RankID|
|RankName|VARCHAR||Name of the police rank (e.g. Constable, Inspector, DSP)|
|Hierarchy|INT||Rank hierarchy level (lower = higher rank)|
|Active|BIT||Whether the rank is active (1=Active, 0=Inactive)|



#### **Designation** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**DesignationID**|INT|**PK**|Primary key — unique identifier for the designation. Referenced by<br>Employee.DesignationID|
|DesignationName|VARCHAR||Name of the designation (e.g. Investigating Officer, SHO)|
|Active|BIT||Whether the designation is active (1=Active, 0=Inactive)|
|SortOrder|INT||Display sort order for dropdowns/reports|



#### **Employee** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**EmployeeID**|INT|**PK**|Primary key — unique identifier for the police employee. Referenced<br>byCaseMaster.PolicePersonID, ArrestSurrender.IOID|
|DistrictID|INT|**FK**|FK → District.DistrictID — district the employee is currently posted<br>in|
|UnitID|INT|**FK**|FK → Unit.UnitID — unit/police station the employee is assigned to|
|RankID|INT|**FK**|FK → Rank.RankID — current rank of the employee|
|DesignationID|INT|**FK**|FK → Designation.DesignationID — current designation of the<br>employee|
|KGID|VARCHAR||Karnataka Government ID (unique government employee number)|
|FirstName|VARCHAR||First name of the employee|
|EmployeeDOB|DATE||Date of birth of the employee|
|GenderID|INT||Gender of the employee (lookup value)|
|BloodGroupID|INT||Blood group of the employee (lookup value)|
|PhysicallyChallenged|BIT||Flag: whether the employee is physically challenged (1=Yes, 0=No)|
|AppointmentDate|DATE||Date of appointment to government service|



#### **CaseCategory** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CaseCategoryID**|INT|**PK**|Primary key — unique identifier for the case category. Referenced<br>byCaseMaster.CaseCategoryID|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|LookupValue|VARCHAR||Category name (FIR, UDR, PAR..)|



#### **GravityOffence** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**GravityOffenceID**|INT|**PK**|Primary key — unique identifier for the gravity level. Referenced by<br>CaseMaster.GravityOffenceID|
|LookupValue|VARCHAR||Gravity description (e.g. Heinous, Non-Heinous)|



#### **ChargesheetDetails** 

|**Column Name**|**Type**|**Key**|**Description**|
|---|---|---|---|
|**CSID**|INT|**PK**|Primarykey— unique identifier for the chargesheet|
|CaseMasterID|INT|**FK**|FK → CaseMaster.CaseMasterID — FIR/case filed by this<br>complainant|
|csdate|DATETIME||Chargesheeted date|
|cstype|CHAR||Final report type A-> Chargesheet, B->False Case, C->Undetected|
|PolicePersonID|INT|**FK**|FK → employeeMaster.employee ID|



## **Relationshi Matrix** **<u>p</u>** 

Defines all foreign key relationships between tables, including cardinality and a brief description. 

|**Parent Table**|**Parent Column**|**Relationshi**<br>**p**|**Child Table**|**Child Column**|**Description**|
|---|---|---|---|---|---|
|**CaseMaster**|CaseMasterID|**One to Many**|**Victim**|CaseMasterID|One FIR can<br>have multiple<br>victims|
|**CaseMaster**|CaseMasterID|**One to Many**|**Accused**|CaseMasterID|One FIR can<br>have multiple<br>accused<br>persons|
|**CaseMaster**|CaseMasterID|**One to Many**|**ArrestSurrender**|CaseMasterID|One FIR can<br>have multiple<br>arrest/surrend<br>er events|
|**CaseMaster**|CaseMasterID|**One to Many**|**ComplainantDetails**|CaseMasterID|One FIR can<br>have multiple<br>complainants|
|**CaseMaster**|CaseMasterID|**One to Many**|**ActSectionAssociation**|CaseMasterID|One FIR can<br>invoke multiple<br>act-sections|
|**CaseMaster**|CaseMasterID|**One to One**|**Inv_OccuranceTime**|CaseMasterID|One FIR has<br>one<br>occurrence<br>time/location<br>record|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Parent Table**|**Parent Column**|**Relationshi**<br>**p**|**Child Table**|**Child Column**|**Description**|
|---|---|---|---|---|---|
|**CaseMaster**|CaseCategoryID|**Many to One**|**CaseCategory**|CaseCategoryID|Many FIRs<br>can share the<br>same category|
|**CaseMaster**|GravityOffenceID|**Many to One**|**GravityOffence**|GravityOffenceI<br>D|Many FIRs<br>can have the<br>same gravity<br>level|
|**CaseMaster**|CrimeMajorHeadID|**Many to One**|**CrimeHead**|CrimeHeadID|Many FIRs<br>can share the<br>same major<br>crime head|
|**CaseMaster**|CrimeMinorHeadID|**Many to One**|**CrimeSubHead**|CrimeSubHeadI<br>D|Many FIRs<br>can share the<br>same crime<br>sub-head|
|**CaseMaster**|CaseStatusID|**Many to One**|**CaseStatusMaster**|CaseStatusID|Many FIRs<br>can have the<br>same status|
|**CaseMaster**|CourtID|**Many to One**|**Court**|CourtID|Many FIRs<br>can be tried in<br>the same court|
||||||Many FIRs|
|**CaseMaster**|PolicePersonID|**Many to One**|**Employee**|EmployeeID|can be<br>registered by<br>the same<br>employee|
|**ArrestSurrender**|AccusedMasterID(via<br>junction)|**One to Many**|**inv_arrestsurrenderaccus**<br>**ed**|ArrestSurrenderI<br>D|One arrest<br>event can link<br>multiple<br>accused via<br>junction|
|**inv_arrestsurrenderaccus**<br>**ed**|ArrestSurrenderID|**Many to One**|**ArrestSurrender**|ArrestSurrenderI<br>D|Junction links<br>to the<br>arrest/surrend<br>er event|
|**ArrestSurrender**|ArrestSurrenderStateId|**Many to One**|**State**|StateID|Many arrest<br>events can<br>occur in the<br>same state|
|**ArrestSurrender**|ArrestSurrenderDistrict<br>Id|**Many to One**|**District**|DistrictID|Many arrest<br>events can<br>occur in the<br>same district|
|**ArrestSurrender**|CourtID|**Many to One**|**Court**|CourtID|Accused may<br>be produced<br>before a court|
|**ArrestSurrender**|IOID|**Many to One**|**Employee**|EmployeeID|Many arrests<br>can be made<br>by the same<br>IO|
||||||Many<br>|
|**ComplainantDetails**|OccupationID|**Many to One**|**OccupationMaster**|OccupationID|complainants<br>can share the<br>same<br>occupation|
|**ComplainantDetails**|ReligionID|**Many to One**|**ReligionMaster**|ReligionID|Many<br>complainants<br>can share the<br>same religion|
|**ComplainantDetails**|CasteID|**Many to One**|**CasteMaster**|caste_master_id|Many<br>complainants<br>can belongto|



Karnataka Police Department | Confidential 

Police FIR System — ER Diagram 

|**Parent Table**|**Parent Column**|**Relationshi**<br>**p**|**Child Table**|**Child Column**|**Description**|
|---|---|---|---|---|---|
||||||the same<br>caste|
|**ActSectionAssociation**|ActID|**Many to One**|**Act**|ActCode|Many case-<br>sections can<br>reference the<br>same act|
|**ActSectionAssociation**|SectionID|**Many to One**|**Section**|SectionCode|Many cases<br>can use the<br>same section|
|**CrimeSubHead**|CrimeHeadID|**Many to One**|**CrimeHead**|CrimeHeadID|Multiple sub-<br>heads fall<br>under one<br>major crime<br>head|
||||||One crime|
|**CrimeHead**|CrimeHeadID|**One to Many**|**CrimeHeadActSection**|CrimeHeadID|head can map<br>to multiple act-<br>sections|
|**Act**|ActCode|**One to Many**|**CrimeHeadActSection**|ActCode|One act can<br>be linked to<br>multiple crime<br>heads|
|**Act**|ActCode|**One to Many**|**Section**|ActCode|One act<br>contains<br>multiple<br>sections|
|**Court**|DistrictID|**Many to One**|**District**|DistrictID|Many courts<br>can be in the<br>same district|
|**District**|StateID|**Many to One**|**State**|StateID|Many districts<br>belong to one<br>state|
|**Unit**|TypeID|**Many to One**|**UnitType**|UnitTypeID|Many units<br>share the<br>same unit type|
|**Unit**|StateID|**Many to One**|**State**|StateID|Many units are<br>located in the<br>same state|
|**Unit**|DistrictID|**Many to One**|**District**|DistrictID|Many units<br>belong to the<br>same district|
||||||Many|
|**Employee**|DistrictID|**Many to One**|**District**|DistrictID|employees<br>posted in the<br>same district|
||||||Many|
|**Employee**|UnitID|**Many to One**|**Unit**|UnitID|employees<br>assigned to<br>the same unit|
||||||Many|
|**Employee**|RankID|**Many to One**|**Rank**|RankID|<br>employees<br>can hold the<br>same rank|
||||||Many<br>emloees|
|**Employee**|DesignationID|**Many to One**|**Designation**|DesignationID|py<br>can have the<br>same<br>designation|



Karnataka Police Department | Confidential 

