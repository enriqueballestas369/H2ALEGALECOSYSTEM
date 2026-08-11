import React, { useState, useEffect, useMemo, useCallback } from "react";

/* ============================================================
   H-2A AGRICULTURAL WORKFORCE NAVIGATOR
   Personal HR/legal compliance reference & navigation tool.
   Architecture-first build: content is a small, verified seed set,
   structured so it can be expanded topic-by-topic over time.
   ============================================================ */

/* ---------------------------- TOKENS ---------------------------- */
const C = {
  navy: "#1B2A4A",
  navySoft: "#EDF1F7",
  blue: "#2E5C8A",
  blueSoft: "#EAF1F8",
  teal: "#0E7C86",
  tealSoft: "#E8F5F5",
  gray: "#6B7280",
  graySoft: "#F1F1EF",
  gold: "#8A5F00",
  goldSoft: "#FBF3DF",
  orange: "#B14A0B",
  orangeSoft: "#FCEEE4",
  burgundy: "#7A2436",
  burgundySoft: "#F6E9EC",
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  border: "#E4E2DA",
  borderStrong: "#CFCCC0",
  text: "#20232B",
  textSoft: "#5B5F6B",
  textFaint: "#8A8D96",
};

const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* ---------------------------- DATA ---------------------------- */

const AGENCIES = {
  "dol-eta-oflc": {
    id: "dol-eta-oflc",
    name: "DOL — Employment & Training Administration (Office of Foreign Labor Certification)",
    short: "DOL / ETA-OFLC",
    role: "Reviews and certifies H-2A Applications for Temporary Employment Certification; runs the job order / domestic recruitment process through State Workforce Agencies.",
    touches: "H-2A workers; the domestic recruitment window that corresponding employment obligations flow from.",
    laws: ["h2a-labor-cert"],
    interaction: "Filing job orders, ETA-9142A applications, responding to recruitment reports and audits.",
    site: "https://www.dol.gov/agencies/eta/foreign-labor",
  },
  "dol-whd": {
    id: "dol-whd",
    name: "DOL — Wage and Hour Division",
    short: "DOL / WHD",
    role: "Investigates and enforces H-2A contractual obligations, FLSA, and MSPA — wages, housing, transportation, recordkeeping, and retaliation.",
    touches: "H-2A workers, corresponding employment, migrant and seasonal agricultural workers, domestic agricultural workers.",
    laws: ["h2a-whd-enforcement", "flsa", "mspa"],
    interaction: "Complaint-driven and targeted investigations, wage back-pay assessments, debarment referrals.",
    site: "https://www.dol.gov/agencies/whd",
  },
  uscis: {
    id: "uscis",
    name: "U.S. Citizenship and Immigration Services",
    short: "USCIS",
    role: "Adjudicates the I-129 petition for H-2A classification after DOL certification; issues Form I-9 guidance.",
    touches: "H-2A workers (petition stage); all new hires (I-9 form and E-Verify guidance).",
    laws: ["h2a-labor-cert", "irca-i9"],
    interaction: "I-129 petition filings, I-9 central resources, E-Verify (if enrolled).",
    site: "https://www.uscis.gov",
  },
  dhs: {
    id: "dhs",
    name: "U.S. Department of Homeland Security",
    short: "DHS",
    role: "Parent agency for immigration enforcement and admission of H-2A nonimmigrants at ports of entry (CBP); receives early-termination notifications.",
    touches: "H-2A workers.",
    laws: ["h2a-labor-cert"],
    interaction: "Reporting no-shows, early terminations, and abandonments through the H-2A portal.",
    site: "https://www.dhs.gov",
  },
  epa: {
    id: "epa",
    name: "U.S. Environmental Protection Agency",
    short: "EPA",
    role: "Administers the Worker Protection Standard for agricultural pesticides under FIFRA.",
    touches: "Workers and handlers with potential pesticide exposure — H-2A, domestic, migrant, and seasonal alike.",
    laws: ["epa-wps"],
    interaction: "Application exclusion zones, restricted-entry intervals, pesticide safety training records.",
    site: "https://www.epa.gov/pesticide-worker-safety",
  },
  osha: {
    id: "osha",
    name: "Occupational Safety and Health Administration",
    short: "OSHA",
    role: "Sets and enforces workplace safety standards, including field sanitation and (by reference within DOL housing rules) temporary labor camp standards.",
    touches: "All agricultural employees regardless of visa status.",
    laws: ["osha-field-sanitation", "osha-housing-standard"],
    interaction: "Field sanitation inspections, heat-illness prevention guidance, housing-standard cross-references in H-2A audits.",
    site: "https://www.osha.gov",
  },
  eeoc: {
    id: "eeoc",
    name: "Equal Employment Opportunity Commission",
    short: "EEOC",
    role: "Enforces Title VII and related federal anti-discrimination statutes in recruitment, employment, and separation.",
    touches: "All employees; recruitment materials and job orders.",
    laws: ["title-vii-eeoc"],
    interaction: "Charges of discrimination, EEO-1 obligations where applicable, poster requirements.",
    site: "https://www.eeoc.gov",
  },
  "doj-ier": {
    id: "doj-ier",
    name: "DOJ — Immigrant and Employee Rights Section",
    short: "DOJ / IER",
    role: "Enforces the anti-discrimination provision of the INA — citizenship, immigration status, and national origin discrimination in hiring, firing, and I-9/E-Verify practices.",
    touches: "All workers, with particular relevance where H-2A and domestic recruitment overlap.",
    laws: ["ina-discrimination"],
    interaction: "Charges related to over-documentation at I-9, unfair recruitment practices favoring or excluding H-2A candidates.",
    site: "https://www.justice.gov/ier",
  },
  "dot-fmcsa": {
    id: "dot-fmcsa",
    name: "DOT — Federal Motor Carrier Safety Administration",
    short: "DOT / FMCSA",
    role: "Sets vehicle and driver safety standards that may apply when the employer or a farm labor contractor transports workers, depending on vehicle size and route.",
    touches: "Workers transported by employer- or FLC-provided vehicles.",
    laws: ["dot-motor-carrier"],
    interaction: "Vehicle safety/insurance verification, CDL and driver-qualification checks where thresholds are met.",
    site: "https://www.fmcsa.dot.gov",
  },
  irs: {
    id: "irs",
    name: "Internal Revenue Service",
    short: "IRS",
    role: "Administers federal payroll tax treatment of agricultural labor, including the FICA/FUTA treatment questions specific to H-2A wages.",
    touches: "All agricultural payroll.",
    laws: [],
    interaction: "Form 943 agricultural payroll tax return; H-2A wages generally not subject to FICA/FUTA, but income-tax withholding and 1042-S/W-2 issues require case-by-case verification.",
    site: "https://www.irs.gov/businesses/small-businesses-self-employed/agricultural-employers-hiring-h-2a-workers",
  },
  ssa: {
    id: "ssa",
    name: "Social Security Administration",
    short: "SSA",
    role: "Administers Social Security number verification services used in payroll onboarding.",
    touches: "Domestic and corresponding-employment workers requiring SSNs for payroll.",
    laws: [],
    interaction: "SSN verification service (SSNVS) for wage reporting accuracy.",
    site: "https://www.ssa.gov/employer",
  },
  "mn-dli": {
    id: "mn-dli",
    name: "Minnesota Department of Labor and Industry",
    short: "MN DLI",
    role: "Administers Minnesota wage, hour, and (per program) migrant-worker housing standards; state OSHA-equivalent safety enforcement.",
    touches: "Workers employed in Minnesota, including H-2A and domestic agricultural workers.",
    laws: ["mn-migrant-housing"],
    interaction: "State housing inspections and licensing where applicable; state wage-theft law compliance.",
    site: "https://www.dli.mn.gov",
  },
  "mn-dhr": {
    id: "mn-dhr",
    name: "Minnesota Department of Human Rights",
    short: "MN DHR",
    role: "Enforces the Minnesota Human Rights Act — the state-law counterpart to Title VII, with broader protected classes.",
    touches: "All employees working in Minnesota.",
    laws: ["mn-human-rights"],
    interaction: "State discrimination charges, required workplace postings.",
    site: "https://mn.gov/mdhr",
  },
};

const LAWS = {
  "h2a-labor-cert": {
    id: "h2a-labor-cert",
    name: "H-2A Temporary Agricultural Labor Certification",
    jurisdiction: "federal",
    statute: "8 U.S.C. § 1188",
    regulation: "20 C.F.R. Part 655, Subpart B",
    agencyGuidanceOnly: false,
    agencies: ["dol-eta-oflc", "uscis", "dhs"],
    purpose: "Sets the process and substantive job-order obligations an employer must meet to certify that no sufficient U.S. workers are available and that hiring H-2A workers won't adversely affect similarly employed U.S. workers.",
    workerTypes: ["h2a-worker", "corresponding-employment"],
    topics: ["recruitment", "wages", "housing", "transportation", "termination-separation", "return-transportation", "recordkeeping", "notices-posters", "farm-labor-contractors"],
    level2: {
      coverage: "Employers petitioning for H-2A workers and every job opportunity listed on the certified job order, including any workers in corresponding employment on that order.",
      obligations: [
        "Positive recruitment of U.S. workers before and during the certification window",
        "Adverse Effect Wage Rate (AEWR) or higher, whichever wage obligation is highest",
        "Free, compliant housing for workers who cannot reasonably return home daily",
        "Inbound and outbound transportation and subsistence reimbursement",
        "Three-fourths guarantee of the contract period's work hours",
        "Written work contract / job order as the floor for all terms and conditions",
      ],
      thresholds: "50% rule on early departures, 3/4-guarantee calculation window, and daily commuting-distance triggers for housing are all fact-specific — verify against the current job order and regulatory text rather than assuming a fixed number.",
    },
    level3: {
      forms: ["ETA Form 9142A (Application for Temporary Employment Certification)", "Form I-129, H Classification Supplement"],
      guidance: ["DOL OFLC H-2A program webpage and FAQs"],
    },
    officialSources: [
      { label: "eCFR — 20 CFR Part 655, Subpart B", url: "https://www.ecfr.gov/current/title-20/chapter-V/part-655/subpart-B" },
      { label: "DOL ETA — H-2A Program", url: "https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2a" },
    ],
    keyQuestions: [
      "Is this job opportunity actually on the certified job order, or is it different work?",
      "Does this worker fall under the job order even without an H-2A visa (corresponding employment)?",
      "Has the recruitment period closed, and does that change our obligations to U.S. applicants?",
    ],
    verified: true,
    lastVerified: "2026-08-11",
    riskFlag: true,
  },
  "h2a-whd-enforcement": {
    id: "h2a-whd-enforcement",
    name: "H-2A Enforcement of Contractual Obligations",
    jurisdiction: "federal",
    statute: "8 U.S.C. § 1188",
    regulation: "29 C.F.R. Part 501",
    agencies: ["dol-whd"],
    purpose: "Gives WHD investigatory and enforcement authority over the wage, housing, transportation, and other terms an H-2A employer promised in its certified job order.",
    workerTypes: ["h2a-worker", "corresponding-employment"],
    topics: ["wages", "hours-overtime", "housing", "transportation", "retaliation", "recordkeeping", "termination-separation"],
    level2: {
      coverage: "Same population as the underlying job order — H-2A workers and workers in corresponding employment.",
      obligations: [
        "Maintain payroll and hours records supporting the job order's wage promises",
        "Respond to WHD investigations covering the certification period",
        "No retaliation against workers who raise concerns to WHD or cooperate with an investigation",
      ],
      thresholds: "Back-wage exposure and civil money penalty ranges change periodically — verify current amounts directly with WHD rather than relying on a remembered figure.",
    },
    level3: {
      forms: ["WHD narrative reports / investigation findings letters (not proactively filed by employer)"],
      guidance: ["WHD Fact Sheet #26 — Section H-2A of the INA"],
    },
    officialSources: [{ label: "eCFR — 29 CFR Part 501", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/part-501" }],
    keyQuestions: ["Do our payroll records tie back to the exact wage promises in the job order?", "Could a WHD investigator reconstruct hours worked from our current recordkeeping?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  flsa: {
    id: "flsa",
    name: "Fair Labor Standards Act — Agricultural Provisions",
    jurisdiction: "federal",
    statute: "29 U.S.C. § 201 et seq. (agricultural exemptions at § 213)",
    regulation: "29 C.F.R. Parts 780, 788",
    agencies: ["dol-whd"],
    purpose: "Sets the federal minimum wage floor and defines which agricultural work is exempt from the FLSA's overtime requirement and, in narrower cases, minimum wage.",
    workerTypes: ["domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker", "h2a-worker", "corresponding-employment"],
    topics: ["wages", "hours-overtime", "recordkeeping", "notices-posters"],
    level2: {
      coverage: "Agricultural employees generally; H-2A workers are covered by FLSA minimum wage but the H-2A job order's own wage rate typically exceeds it.",
      obligations: ["Pay at least the higher of federal minimum wage or the applicable H-2A/state wage rate", "Track hours worked with enough detail to verify wage compliance"],
      thresholds: "The FLSA overtime exemption for agricultural work (§ 213(b)(12)) and the small-farm minimum-wage exemption (§ 213(a)(6)) both hinge on specific labor-hour and operation-size tests — verify against current DOL Fact Sheets before relying on an exemption.",
    },
    level3: { forms: [], guidance: ["WHD Fact Sheet #12 — Agricultural Employers"] },
    officialSources: [{ label: "DOL WHD — Agriculture", url: "https://www.dol.gov/agencies/whd/agriculture" }],
    keyQuestions: ["Does this role actually meet the agricultural exemption test, or is it mixed agricultural/non-agricultural work?", "Are we tracking hours precisely enough to defend a wage calculation later?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  mspa: {
    id: "mspa",
    name: "Migrant and Seasonal Agricultural Worker Protection Act (MSPA)",
    jurisdiction: "federal",
    statute: "29 U.S.C. § 1801 et seq.",
    regulation: "29 C.F.R. Part 500",
    agencies: ["dol-whd"],
    purpose: "Protects migrant and seasonal agricultural workers (a defined statutory population, not H-2A workers by default) through disclosure, wage, housing, transportation, and farm labor contractor registration requirements.",
    workerTypes: ["migrant-ag-worker", "seasonal-ag-worker", "domestic-ag-worker"],
    topics: ["recruitment", "wages", "housing", "transportation", "retaliation", "recordkeeping", "notices-posters", "farm-labor-contractors"],
    level2: {
      coverage: "Migrant and seasonal agricultural workers as MSPA defines them; H-2A workers are generally excluded from MSPA's core provisions but this exclusion is fact-specific and worth verifying per role.",
      obligations: [
        "Written disclosure of wage rates, housing, and other terms at time of recruitment",
        "Farm labor contractors must be federally registered",
        "Housing and vehicles used to transport workers must meet safety/health standards",
      ],
      thresholds: "MSPA's exact worker-count and small-business exemptions are narrow and fact-dependent — do not assume an exemption applies without checking current WHD guidance.",
    },
    level3: { forms: ["WH-516 (disclosure forms vary by activity)"], guidance: ["WHD Fact Sheet #49 — MSPA"] },
    officialSources: [{ label: "DOL WHD — MSPA", url: "https://www.dol.gov/agencies/whd/agriculture/mspa" }],
    keyQuestions: ["Is this worker migrant/seasonal under MSPA's definition, or are they actually an H-2A worker (different framework)?", "If we use a farm labor contractor, is their federal registration current?"],
    verified: true,
    lastVerified: "2026-08-11",
    riskFlag: true,
  },
  "irca-i9": {
    id: "irca-i9",
    name: "Employment Eligibility Verification (Form I-9)",
    jurisdiction: "federal",
    statute: "INA § 274A, 8 U.S.C. § 1324a",
    regulation: "8 C.F.R. Part 274a",
    agencies: ["uscis", "dhs"],
    purpose: "Requires every employer to verify identity and work authorization for all new hires, regardless of citizenship, using Form I-9.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker", "regular-domestic-employee"],
    topics: ["employment-verification", "discrimination", "recordkeeping"],
    level2: {
      coverage: "Every employee hired, including H-2A workers — H-2A status does not exempt a worker from I-9.",
      obligations: ["Complete Section 1 by first day of work, Section 2 within 3 business days", "Retain I-9s per the statutory retention formula", "Do not demand more or different documents than the law allows"],
      thresholds: "Retention period is the later of 3 years after hire or 1 year after termination — verify against current USCIS guidance before purging records.",
    },
    level3: { forms: ["Form I-9"], guidance: ["USCIS I-9 Central"] },
    officialSources: [{ label: "USCIS — I-9 Central", url: "https://www.uscis.gov/i-9-central" }],
    keyQuestions: ["Are we treating H-2A visa documents correctly for I-9 purposes without over-documenting?", "Do our I-9 practices differ by worker type in a way that could look like discrimination?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "epa-wps": {
    id: "epa-wps",
    name: "Worker Protection Standard for Agricultural Pesticides",
    jurisdiction: "federal",
    statute: "FIFRA, 7 U.S.C. § 136 et seq.",
    regulation: "40 C.F.R. Part 170",
    agencies: ["epa"],
    purpose: "Reduces pesticide exposure risk for agricultural workers and pesticide handlers through training, notification, and re-entry rules.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker"],
    topics: ["pesticide-safety", "notices-posters", "recordkeeping"],
    level2: {
      coverage: "Any worker or handler on an agricultural establishment covered by FIFRA-registered pesticide use.",
      obligations: ["Pesticide safety training before hazardous work begins", "Posted pesticide application and restricted-entry-interval information", "Decontamination supplies and emergency-assistance information on site"],
      thresholds: "Restricted-entry intervals vary by product label — never assume a single interval; always check the specific label.",
    },
    level3: { forms: ["EPA WPS Pesticide Safety Training materials"], guidance: ["EPA Worker Protection Standard How-to guides"] },
    officialSources: [{ label: "EPA — Worker Protection Standard", url: "https://www.epa.gov/pesticide-worker-safety" }],
    keyQuestions: ["Is training documented per worker and current within the required interval?", "Are postings current for whatever was most recently applied?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "osha-field-sanitation": {
    id: "osha-field-sanitation",
    name: "OSHA Field Sanitation Standard",
    jurisdiction: "federal",
    statute: "29 U.S.C. § 654(a) (General Duty Clause, backdrop)",
    regulation: "29 C.F.R. § 1928.110",
    agencies: ["osha"],
    purpose: "Requires potable water, toilet, and handwashing facilities for hand-labor field operations.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker"],
    topics: ["safety", "notices-posters"],
    level2: {
      coverage: "Employers of 11 or more hand-labor field workers on any given day — verify current headcount against the field crew, not the whole operation.",
      obligations: ["Water, toilets, and handwashing within reasonable proximity to the work area", "No retaliation for using the facilities"],
      thresholds: "The 11-worker threshold is a standard trigger to verify against the actual regulatory text before relying on it operationally.",
    },
    level3: { forms: [], guidance: ["OSHA Field Sanitation Fact Sheet"] },
    officialSources: [{ label: "OSHA — 29 CFR 1928.110", url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1928/1928.110" }],
    keyQuestions: ["Does our peak-season crew size cross the field sanitation threshold?", "Are facilities actually within practical reach of remote field crews?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "osha-housing-standard": {
    id: "osha-housing-standard",
    name: "Temporary Labor Camp Housing Standards (as referenced in H-2A housing rules)",
    jurisdiction: "federal",
    statute: "29 U.S.C. § 654(a)",
    regulation: "29 C.F.R. § 1910.142 (referenced by 20 CFR 655 Subpart B where no stricter local/state standard applies)",
    agencies: ["osha", "dol-eta-oflc"],
    purpose: "Sets minimum square footage, sanitation, water supply, and pest-control standards for employer-provided housing used as a fallback when no local housing code is stricter.",
    workerTypes: ["h2a-worker", "corresponding-employment", "migrant-ag-worker"],
    topics: ["housing", "safety"],
    level2: {
      coverage: "H-2A employer-provided housing, and by extension any housing used to satisfy the job order's housing obligation.",
      obligations: ["Minimum square footage per occupant", "Functioning water, toilet, and laundry facilities", "Documented insect and rodent control"],
      thresholds: "Exact square-footage-per-person and toilet-ratio numbers should be pulled from the current regulatory text at inspection time, not memorized.",
    },
    level3: { forms: ["State/local housing inspection certificates, where applicable"], guidance: [] },
    officialSources: [{ label: "eCFR — 29 CFR 1910.142", url: "https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-J/section-1910.142" }],
    keyQuestions: ["Which standard actually governs this housing — local code, state code, or the federal fallback?", "Is the pre-occupancy inspection documented and current?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "title-vii-eeoc": {
    id: "title-vii-eeoc",
    name: "Title VII of the Civil Rights Act of 1964",
    jurisdiction: "federal",
    statute: "42 U.S.C. § 2000e et seq.",
    regulation: "29 C.F.R. Part 1600s (EEOC procedural regulations)",
    agencies: ["eeoc"],
    purpose: "Prohibits employment discrimination based on race, color, religion, sex, and national origin, including in recruitment and job orders.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker", "regular-domestic-employee"],
    topics: ["recruitment", "discrimination", "retaliation", "notices-posters"],
    level2: {
      coverage: "Employers meeting Title VII's employee-count threshold — verify current headcount rules before assuming coverage or exemption.",
      obligations: ["Non-discriminatory recruitment, hiring, and separation decisions", "Required EEOC poster where covered"],
      thresholds: "Employee-count coverage threshold should be verified directly rather than assumed.",
    },
    level3: { forms: [], guidance: ["EEOC — Employer Responsibilities"] },
    officialSources: [{ label: "EEOC — Title VII", url: "https://www.eeoc.gov/statutes/title-vii-civil-rights-act-1964" }],
    keyQuestions: ["Could a recruitment preference for or against H-2A candidates be read as national-origin discrimination?", "Are separation decisions documented with a legitimate, non-discriminatory business reason?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "ina-discrimination": {
    id: "ina-discrimination",
    name: "INA Anti-Discrimination Provision",
    jurisdiction: "federal",
    statute: "INA § 274B, 8 U.S.C. § 1324b",
    regulation: "28 C.F.R. Part 44",
    agencies: ["doj-ier"],
    purpose: "Prohibits citizenship-status and national-origin discrimination in hiring, firing, and I-9/E-Verify practices — distinct from, and narrower in employer-size threshold than, Title VII.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "regular-domestic-employee"],
    topics: ["discrimination", "employment-verification", "recruitment"],
    level2: {
      coverage: "Employers below Title VII's size threshold can still be covered here — this statute closes that gap for citizenship-status claims.",
      obligations: ["Apply I-9/E-Verify document requirements uniformly, without demanding extra documents from noncitizens", "Avoid citizenship-status preferences not required by law or contract"],
      thresholds: "Employer-size coverage threshold differs from Title VII — verify current figure before concluding a company is too small to be covered.",
    },
    level3: { forms: [], guidance: ["DOJ IER — Employer Guidance"] },
    officialSources: [{ label: "DOJ — Immigrant and Employee Rights Section", url: "https://www.justice.gov/ier" }],
    keyQuestions: ["Are we requesting the same I-9 documents from every new hire regardless of perceived citizenship status?", "Could our H-2A vs. domestic recruitment messaging be read as a citizenship preference?"],
    verified: true,
    lastVerified: "2026-08-11",
  },
  "dot-motor-carrier": {
    id: "dot-motor-carrier",
    name: "Federal Motor Carrier Safety Regulations",
    jurisdiction: "federal",
    statute: "49 U.S.C. § 31136 et seq.",
    regulation: "49 C.F.R. Parts 390–399",
    agencies: ["dot-fmcsa"],
    purpose: "Sets vehicle safety, driver qualification, and hours-of-service standards that can apply to farmworker transportation depending on vehicle size, distance, and route type.",
    workerTypes: ["h2a-worker", "migrant-ag-worker", "corresponding-employment"],
    topics: ["transportation"],
    level2: {
      coverage: "Potentially applicable when the vehicle used meets FMCSA's definition of a commercial motor vehicle for passenger transport — this depends on seating capacity and interstate/intrastate status, and some agricultural transport falls under partial exemptions.",
      obligations: ["Verify whether the specific vehicle and route trigger FMCSA driver-qualification or CDL requirements", "Maintain vehicle safety inspection and insurance records if covered"],
      thresholds: "Seating-capacity thresholds that trigger CDL/passenger-carrier rules, and any agricultural-transport exemptions, must be verified per vehicle and route — this is one of the more fact-specific intersections in the whole framework.",
    },
    level3: { forms: [], guidance: ["FMCSA — Agricultural exemptions guidance"] },
    officialSources: [{ label: "FMCSA — Regulations", url: "https://www.fmcsa.dot.gov/regulations" }],
    keyQuestions: ["What is the passenger capacity of the vehicles we actually use to move workers?", "Does our route cross state lines in a way that changes which rules apply?"],
    verified: false,
    lastVerified: "2026-08-11",
  },
  fmla: {
    id: "fmla",
    name: "Family and Medical Leave Act",
    jurisdiction: "federal",
    statute: "29 U.S.C. § 2601 et seq.",
    regulation: "29 C.F.R. Part 825",
    agencies: ["dol-whd"],
    purpose: "Provides unpaid, job-protected leave for qualifying family and medical reasons at covered employers.",
    workerTypes: ["domestic-ag-worker", "regular-domestic-employee", "corresponding-employment"],
    topics: ["leave"],
    level2: {
      coverage: "Coverage and individual eligibility both depend on employer size, worksite employee count, and the employee's hours-worked history — seasonal and short-tenure agricultural workers frequently fail the eligibility test, but this must be checked person-by-person, not assumed.",
      obligations: ["Track hours worked per employee toward FMLA eligibility if the company is a covered employer", "Provide required notices to eligible employees"],
      thresholds: "The 50-employee/75-mile coverage test and the 1,250-hour individual eligibility test should be verified against current DOL guidance for each specific case.",
    },
    level3: { forms: ["WH-380 series certification forms"], guidance: ["DOL WHD — FMLA"] },
    officialSources: [{ label: "DOL WHD — FMLA", url: "https://www.dol.gov/agencies/whd/fmla" }],
    keyQuestions: ["Does this specific employee's hours history meet the eligibility test, given seasonal gaps?", "Is the company itself a covered employer at this worksite?"],
    verified: false,
    lastVerified: "2026-08-11",
  },
  "mn-migrant-housing": {
    id: "mn-migrant-housing",
    name: "Minnesota Migrant Worker Housing Requirements",
    jurisdiction: "state",
    statute: "Minn. Stat. Ch. 181 (labor standards) — exact housing-specific chapter/section needs pinpoint verification",
    regulation: "Minnesota Rules, migrant housing chapter — needs pinpoint verification",
    agencies: ["mn-dli"],
    purpose: "Minnesota's state-level housing standards for migrant agricultural workers, which may add to or run alongside the federal H-2A/OSHA housing fallback standard.",
    workerTypes: ["migrant-ag-worker", "h2a-worker"],
    topics: ["housing"],
    level2: {
      coverage: "Migrant worker housing located in Minnesota.",
      obligations: ["State licensing or inspection of migrant housing, where applicable — verify current process with MN DLI"],
      thresholds: "Not populated — needs pinpoint statutory/rule citation and current inspection thresholds before this card can be treated as reliable.",
    },
    level3: { forms: [], guidance: [] },
    officialSources: [{ label: "MN DLI — Labor Standards", url: "https://www.dli.mn.gov/business/employment-practices" }],
    keyQuestions: ["Does Minnesota require a separate housing license or inspection beyond the federal H-2A housing check?", "Where does the current MN DLI guidance live for this topic?"],
    verified: false,
    lastVerified: "2026-08-11",
    needsResearch: true,
  },
  "mn-human-rights": {
    id: "mn-human-rights",
    name: "Minnesota Human Rights Act",
    jurisdiction: "state",
    statute: "Minn. Stat. Ch. 363A",
    regulation: "Minn. R. Ch. 5000s (MDHR procedural rules)",
    agencies: ["mn-dhr"],
    purpose: "State-law anti-discrimination statute covering Minnesota employers, with a broader list of protected classes than Title VII.",
    workerTypes: ["h2a-worker", "corresponding-employment", "domestic-ag-worker", "migrant-ag-worker", "seasonal-ag-worker", "regular-domestic-employee"],
    topics: ["discrimination", "retaliation", "notices-posters"],
    level2: {
      coverage: "Employers with employees working in Minnesota — coverage threshold is lower than federal Title VII in some respects; verify current threshold.",
      obligations: ["Non-discriminatory treatment across the MHRA's protected classes", "Required state poster"],
      thresholds: "Employee-count coverage threshold should be verified directly with MDHR guidance.",
    },
    level3: { forms: [], guidance: ["MDHR — Employer Resources"] },
    officialSources: [{ label: "Minnesota Dept. of Human Rights", url: "https://mn.gov/mdhr" }],
    keyQuestions: ["Does the MHRA cover a protected class relevant here that Title VII does not?", "Is our state poster current?"],
    verified: false,
    lastVerified: "2026-08-11",
    needsResearch: true,
  },
};

const WORKER_TYPES = {
  "h2a-worker": {
    id: "h2a-worker",
    name: "H-2A Worker",
    who: "A foreign national admitted under an H-2A visa specifically to perform the temporary or seasonal agricultural labor listed on a certified job order.",
    whyMatters: "Every term of employment traces back to the certified job order — wages, housing, transportation, and hours are not general HR discretion, they are contractual commitments made to the government.",
    frameworks: ["h2a-labor-cert", "h2a-whd-enforcement", "irca-i9", "epa-wps", "osha-field-sanitation", "osha-housing-standard", "title-vii-eeoc"],
    keyDistinctions: ["Status is tied to a specific employer and job order, not portable like most work visas.", "Subject to the 3/4-guarantee, not ordinary at-will wage exposure."],
    doNotConfuseWith: "Corresponding employment — a worker in corresponding employment performs the same work but is not an H-2A visa holder.",
  },
  "corresponding-employment": {
    id: "corresponding-employment",
    name: "Corresponding Employment",
    who: "A worker who is not an H-2A visa holder but who is employed by the H-2A employer during the certified period in the same or substantially similar work covered by the job order.",
    whyMatters: "The job order's wage and working-condition promises generally extend to these workers too — you cannot pay an H-2A worker one rate and a corresponding-employment worker doing the same row a lower rate.",
    frameworks: ["h2a-labor-cert", "h2a-whd-enforcement", "flsa"],
    keyDistinctions: ["Defined relative to the job order's scope of work and time period, not by any visa status of their own.", "Can include existing domestic staff whose duties happen to overlap the H-2A job order."],
    doNotConfuseWith: "A regular domestic employee doing unrelated work — corresponding employment is specifically about overlap with the certified job order.",
  },
  "domestic-ag-worker": {
    id: "domestic-ag-worker",
    name: "Domestic Agricultural Worker",
    who: "A U.S. worker (citizen or otherwise work-authorized) performing agricultural labor, without regard to whether they are migratory or seasonal under MSPA's specific definitions.",
    whyMatters: "The baseline population FLSA agricultural provisions and general employment law apply to; may or may not also meet MSPA's narrower migrant/seasonal definitions.",
    frameworks: ["flsa", "irca-i9", "epa-wps", "osha-field-sanitation", "title-vii-eeoc"],
    keyDistinctions: ["Not automatically a 'migrant' or 'seasonal' worker under MSPA — that requires meeting MSPA's specific statutory test."],
    doNotConfuseWith: "Migrant or seasonal agricultural worker — those are defined MSPA terms with their own triggered obligations.",
  },
  "migrant-ag-worker": {
    id: "migrant-ag-worker",
    name: "Migrant Agricultural Worker",
    who: "An MSPA-defined term: an agricultural worker employed in agricultural work of a seasonal or other temporary nature who is required to be absent overnight from their permanent place of residence.",
    whyMatters: "Triggers MSPA's disclosure, wage, housing, and transportation protections — a distinct and often stricter framework than ordinary domestic employment.",
    frameworks: ["mspa", "flsa", "epa-wps", "osha-housing-standard"],
    keyDistinctions: ["The 'away from permanent residence overnight' element is what separates this from a seasonal worker who commutes from home."],
    doNotConfuseWith: "An H-2A worker — H-2A workers are generally excluded from MSPA's core coverage, though this exclusion is fact-specific and worth verifying per situation.",
  },
  "seasonal-ag-worker": {
    id: "seasonal-ag-worker",
    name: "Seasonal Agricultural Worker",
    who: "An MSPA-defined term: an agricultural worker employed on a seasonal basis who is not required to be absent overnight from their permanent residence.",
    whyMatters: "Also triggers MSPA protections, but the housing/overnight-travel-specific obligations differ from the migrant-worker category.",
    frameworks: ["mspa", "flsa", "epa-wps"],
    keyDistinctions: ["Distinguished from a migrant worker by the absence of the overnight-travel element."],
    doNotConfuseWith: "A year-round domestic agricultural employee performing steady, non-seasonal work.",
  },
  "regular-domestic-employee": {
    id: "regular-domestic-employee",
    name: "Regular Domestic Employee (Non-Agricultural)",
    who: "Office, administrative, or other staff whose role is not agricultural labor — e.g., HR, accounting, or facilities staff at an agricultural operation.",
    whyMatters: "None of the H-2A, MSPA, or agricultural FLSA provisions apply to this role by default — ordinary general employment law governs instead.",
    frameworks: ["irca-i9", "title-vii-eeoc", "ina-discrimination", "fmla"],
    keyDistinctions: ["Physical presence at an agricultural operation does not make a role agricultural for legal purposes — the actual duties do."],
    doNotConfuseWith: "Any of the agricultural worker categories above — mixing frameworks here is a common source of over- or under-compliance.",
  },
};

const TOPICS = {
  recruitment: { id: "recruitment", name: "Recruitment", laws: ["h2a-labor-cert", "mspa", "title-vii-eeoc", "ina-discrimination"] },
  wages: { id: "wages", name: "Wages", laws: ["h2a-labor-cert", "h2a-whd-enforcement", "flsa", "mspa"] },
  "hours-overtime": { id: "hours-overtime", name: "Hours & Overtime", laws: ["flsa", "h2a-whd-enforcement"] },
  housing: { id: "housing", name: "Housing", laws: ["h2a-labor-cert", "h2a-whd-enforcement", "mspa", "osha-housing-standard", "mn-migrant-housing"] },
  transportation: { id: "transportation", name: "Transportation", laws: ["h2a-labor-cert", "h2a-whd-enforcement", "mspa", "dot-motor-carrier"] },
  safety: { id: "safety", name: "Safety (OSHA)", laws: ["osha-field-sanitation", "osha-housing-standard", "mspa"] },
  "pesticide-safety": { id: "pesticide-safety", name: "Pesticide Safety (WPS)", laws: ["epa-wps"] },
  "employment-verification": { id: "employment-verification", name: "Employment Verification (I-9)", laws: ["irca-i9", "ina-discrimination"] },
  discrimination: { id: "discrimination", name: "Discrimination", laws: ["title-vii-eeoc", "ina-discrimination", "mn-human-rights"] },
  retaliation: { id: "retaliation", name: "Retaliation", laws: ["mspa", "flsa", "h2a-whd-enforcement", "title-vii-eeoc"] },
  leave: { id: "leave", name: "Leave", laws: ["fmla"] },
  "termination-separation": { id: "termination-separation", name: "Termination / Separation", laws: ["h2a-labor-cert", "h2a-whd-enforcement"] },
  "return-transportation": { id: "return-transportation", name: "Return Transportation", laws: ["h2a-labor-cert"] },
  recordkeeping: { id: "recordkeeping", name: "Recordkeeping", laws: ["flsa", "mspa", "h2a-whd-enforcement", "irca-i9", "epa-wps"] },
  "notices-posters": { id: "notices-posters", name: "Required Notices / Posters", laws: ["h2a-labor-cert", "mspa", "flsa", "osha-field-sanitation", "epa-wps", "title-vii-eeoc", "mn-human-rights"] },
  "farm-labor-contractors": { id: "farm-labor-contractors", name: "Farm Labor Contractors", laws: ["mspa", "h2a-labor-cert"] },
};

const LIFECYCLE = [
  { id: "planning", name: "Planning", what: "Forecasting labor needs and deciding whether H-2A, domestic recruitment, or both will fill the gap.", laws: ["h2a-labor-cert"], agencies: ["dol-eta-oflc"], hrQuestions: ["Is the labor shortage real and documentable, or a scheduling problem?"] },
  { id: "labor-cert", name: "Labor Certification", what: "Filing the Application for Temporary Employment Certification and job order with DOL.", laws: ["h2a-labor-cert"], agencies: ["dol-eta-oflc"], hrQuestions: ["Does the job order accurately describe every duty workers will actually perform?"] },
  { id: "domestic-recruit", name: "Domestic Recruitment", what: "Positive recruitment of U.S. workers through the State Workforce Agency and other required channels before H-2A workers are approved.", laws: ["h2a-labor-cert", "title-vii-eeoc"], agencies: ["dol-eta-oflc", "eeoc"], hrQuestions: ["Are we documenting every U.S. applicant's disposition with a lawful, consistent reason?"] },
  { id: "worker-selection", name: "Worker Selection", what: "Selecting which U.S. and/or H-2A workers fill the certified positions.", laws: ["title-vii-eeoc", "ina-discrimination"], agencies: ["eeoc", "doj-ier"], hrQuestions: ["Is the selection process documented the same way regardless of worker category?"] },
  { id: "visa-immigration", name: "Visa / Immigration Process", what: "I-129 petition, consular processing, and admission at the port of entry.", laws: ["h2a-labor-cert"], agencies: ["uscis", "dhs"], hrQuestions: ["Who owns tracking petition and visa timelines against the job order's start date?"] },
  { id: "pre-arrival", name: "Pre-Arrival", what: "Confirming housing readiness, transportation logistics, and onboarding paperwork before workers arrive.", laws: ["h2a-labor-cert", "osha-housing-standard"], agencies: ["dol-eta-oflc", "osha"], hrQuestions: ["Has housing been inspected and documented as compliant before anyone moves in?"] },
  { id: "arrival", name: "Arrival", what: "Inbound transportation and reimbursement, initial check-in.", laws: ["h2a-labor-cert"], agencies: ["dol-whd"], hrQuestions: ["Is inbound transportation/subsistence reimbursement processed on the required timeline?"] },
  { id: "onboarding", name: "Onboarding", what: "I-9 completion, safety and pesticide-safety training, payroll setup.", laws: ["irca-i9", "epa-wps"], agencies: ["uscis", "epa"], hrQuestions: ["Is I-9 timing (Section 1 day one, Section 2 within 3 business days) being met consistently?"] },
  { id: "active-employment", name: "Active Employment", what: "Day-to-day supervision, hours tracking, and wage payment against the job order.", laws: ["flsa", "h2a-whd-enforcement"], agencies: ["dol-whd"], hrQuestions: ["Do timekeeping records support the wage promises made in the job order?"] },
  { id: "housing-transport", name: "Housing / Transportation (Ongoing)", what: "Maintaining housing conditions and daily transportation throughout the work period.", laws: ["osha-housing-standard", "mspa", "dot-motor-carrier"], agencies: ["osha", "dol-whd", "dot-fmcsa"], hrQuestions: ["Who is responsible for ongoing housing maintenance complaints during the season?"] },
  { id: "payroll-wage", name: "Payroll / Wage Administration", what: "Running payroll consistent with AEWR/job-order wage rates and required deductions rules.", laws: ["h2a-whd-enforcement", "flsa"], agencies: ["dol-whd", "irs"], hrQuestions: ["Are deductions limited to those the job order and FLSA actually permit?"] },
  { id: "safety-relations", name: "Safety / Employee Relations", what: "Ongoing safety compliance and handling employee concerns or complaints.", laws: ["osha-field-sanitation", "epa-wps", "mspa"], agencies: ["osha", "epa"], hrQuestions: ["Is there a clear, known channel for workers to raise safety concerns without fear of retaliation?"] },
  { id: "changes", name: "Changes During Employment", what: "Schedule changes, role changes, or amendments that could affect job-order compliance.", laws: ["h2a-labor-cert"], agencies: ["dol-eta-oflc"], hrQuestions: ["Does this change require an amendment to the certified job order?"] },
  { id: "separation", name: "Termination / Resignation / Abandonment", what: "Documenting the reason for separation and, for H-2A workers, notifying DHS of abandonment or termination for cause where required.", laws: ["h2a-labor-cert", "h2a-whd-enforcement"], agencies: ["dhs", "dol-whd"], hrQuestions: ["Have we correctly classified this as termination, resignation, or abandonment, and notified the right agency?"] },
  { id: "end-of-contract", name: "End of Contract", what: "Wrapping up the certified period, final pay, and confirming three-fourths guarantee compliance.", laws: ["h2a-labor-cert", "h2a-whd-enforcement"], agencies: ["dol-whd"], hrQuestions: ["Does the total hours worked satisfy the three-fourths guarantee, and if not, is make-up pay owed?"] },
  { id: "return-transport", name: "Return Transportation", what: "Outbound transportation and subsistence back to the worker's home country/point of recruitment.", laws: ["h2a-labor-cert"], agencies: ["dol-whd"], hrQuestions: ["Is return transportation being offered on the terms the job order promised, not just 'if convenient'?"] },
  { id: "record-retention", name: "Record Retention", what: "Retaining payroll, I-9, housing inspection, and job-order records for the legally required periods.", laws: ["flsa", "mspa", "irca-i9", "h2a-whd-enforcement"], agencies: ["dol-whd", "uscis"], hrQuestions: ["Do our retention periods differ by document type, and are we tracking that correctly?"] },
];

const RESOURCES = [
  { id: "eta-9142a", name: "ETA Form 9142A", purpose: "Application for Temporary Employment Certification (H-2A)", agency: "dol-eta-oflc", who: "Employer / agent filing for H-2A certification", when: "At the start of the certification process", link: "https://www.dol.gov/agencies/eta/foreign-labor/forms", lastVerified: "2026-08-11" },
  { id: "form-i9", name: "Form I-9", purpose: "Employment eligibility verification for every new hire", agency: "uscis", who: "All employers, all new hires", when: "First day of work (Section 1) / within 3 business days (Section 2)", link: "https://www.uscis.gov/i-9-central", lastVerified: "2026-08-11" },
  { id: "whd-h2a-poster", name: "H-2A Job Order / Worker Rights Poster", purpose: "Posted notice of job order terms and worker rights", agency: "dol-whd", who: "H-2A employers, at the worksite", when: "Throughout the certification period", link: "https://www.dol.gov/agencies/whd/agriculture", lastVerified: "2026-08-11" },
  { id: "eeoc-poster", name: "'Know Your Rights' EEOC Poster", purpose: "Required workplace posting of federal EEO rights", agency: "eeoc", who: "Covered employers", when: "Continuously posted", link: "https://www.eeoc.gov/poster", lastVerified: "2026-08-11" },
  { id: "epa-wps-poster", name: "EPA WPS Pesticide Safety Poster", purpose: "Central posting of pesticide application and safety information", agency: "epa", who: "Agricultural establishments using pesticides", when: "Continuously posted, updated after each application", link: "https://www.epa.gov/pesticide-worker-safety", lastVerified: "2026-08-11" },
];

/* ---------------------------- HELPERS ---------------------------- */

const authorityMeta = {
  federal: { label: "FEDERAL", color: C.navy, soft: C.navySoft },
  state: { label: "STATE", color: C.blue, soft: C.blueSoft },
};

const noteTypes = ["MY EXPERIENCE", "PRACTICAL OBSERVATION", "QUESTION TO VERIFY", "LESSON LEARNED", "PROCESS AT MY COMPANY"];
const bookmarkCategories = ["Frequently Used", "Need to Verify", "Current Project", "Interview Example", "Important Source"];
const queueStatuses = ["NOT RESEARCHED", "RESEARCHING", "VERIFIED", "NEEDS LEGAL REVIEW"];

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/* ---------------------------- STORAGE HOOK ---------------------------- */

const DEFAULT_STATE = { notes: {}, bookmarks: [], researchQueue: [] };

const STORAGE_KEY = "h2a-navigator-data";

function useNavigatorData() {
  const [data, setData] = useState(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...DEFAULT_STATE, ...parsed });
      }
    } catch (e) {
      /* no existing data yet, or storage unavailable — use defaults */
    } finally {
      setLoaded(true);
    }
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, []);

  return { data, loaded, saveError, persist };
}

/* ---------------------------- ATOMS ---------------------------- */

function Chip({ children, bg, fg, border, mono, small }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 7px" : "3px 9px",
        borderRadius: 3,
        fontFamily: mono ? MONO : SANS,
        fontSize: small ? 10.5 : 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: bg,
        color: fg,
        border: border ? `1px solid ${border}` : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function AuthorityBadges({ law }) {
  const j = authorityMeta[law.jurisdiction];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {law.statute && (
        <Chip bg={j.soft} fg={j.color}>
          {law.jurisdiction === "federal" ? "Federal Statute" : "State Statute"}
        </Chip>
      )}
      {law.regulation && (
        <Chip bg={j.soft} fg={j.color} border={j.color + "33"}>
          {law.jurisdiction === "federal" ? "Federal Regulation" : "State Rule"}
        </Chip>
      )}
      {!law.verified && (
        <Chip bg={C.orangeSoft} fg={C.orange}>
          Needs Verification
        </Chip>
      )}
      {law.riskFlag && (
        <Chip bg={C.burgundySoft} fg={C.burgundy}>
          High Compliance Risk
        </Chip>
      )}
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: C.textFaint,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function H1({ children, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 600, color: C.navy, margin: 0, letterSpacing: "-0.01em" }}>{children}</h1>
      {sub && <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textSoft, marginTop: 6, maxWidth: 640, lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "18px 0" }} />;
}

function VerifyBadge() {
  return <Chip bg={C.orangeSoft} fg={C.orange}>Needs Verification</Chip>;
}

function ArrowDown() {
  return (
    <div style={{ display: "flex", justifyContent: "center", color: C.borderStrong, fontSize: 15, lineHeight: 1, margin: "2px 0" }}>
      &#8595;
    </div>
  );
}

/* ---------------------------- NOTES PANEL ---------------------------- */

function NotesPanel({ entityId, entityLabel, data, persist }) {
  const [open, setOpen] = useState(false);
  const [draftType, setDraftType] = useState(noteTypes[0]);
  const [draftText, setDraftText] = useState("");
  const notes = data.notes[entityId] || [];

  function addNote() {
    if (!draftText.trim()) return;
    const next = {
      ...data,
      notes: {
        ...data.notes,
        [entityId]: [...notes, { id: uid(), type: draftType, text: draftText.trim(), date: new Date().toISOString().slice(0, 10) }],
      },
    };
    persist(next);
    setDraftText("");
  }

  function removeNote(id) {
    const next = { ...data, notes: { ...data.notes, [entityId]: notes.filter((n) => n.id !== id) } };
    persist(next);
  }

  return (
    <div style={{ marginTop: 14, borderTop: `1px dashed ${C.borderStrong}`, paddingTop: 12 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.gold,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10 }}>{open ? "▾" : "▸"}</span>
        Personal Notes {notes.length > 0 && `(${notes.length})`}
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {notes.length === 0 && (
            <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, fontStyle: "italic" }}>No notes yet on {entityLabel}.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notes.map((n) => (
              <div key={n.id} style={{ background: C.goldSoft, border: `1px solid ${C.gold}22`, borderRadius: 4, padding: "8px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <Chip bg="transparent" fg={C.gold} small>{n.type}</Chip>
                  <button
                    onClick={() => removeNote(n.id)}
                    style={{ background: "none", border: "none", color: C.textFaint, cursor: "pointer", fontSize: 11, fontFamily: SANS }}
                    aria-label="Remove note"
                  >
                    remove
                  </button>
                </div>
                <p style={{ fontFamily: SANS, fontSize: 13, color: C.text, margin: "5px 0 2px", lineHeight: 1.5 }}>{n.text}</p>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.textFaint }}>{n.date}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            <select
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
              style={{ fontFamily: SANS, fontSize: 12.5, padding: "6px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: C.surface, color: C.text, width: "fit-content" }}
            >
              {noteTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Add a note — your own experience or a question to verify, not a legal claim."
              rows={2}
              style={{ fontFamily: SANS, fontSize: 13, padding: "8px 10px", borderRadius: 4, border: `1px solid ${C.border}`, resize: "vertical", color: C.text }}
            />
            <button
              onClick={addNote}
              style={{
                alignSelf: "flex-start",
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 4,
                border: "none",
                background: C.gold,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- BOOKMARK BUTTON ---------------------------- */

function BookmarkButton({ entityType, entityId, label, data, persist }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const existing = data.bookmarks.find((b) => b.entityId === entityId && b.entityType === entityType);

  function toggleCategory(category) {
    let next;
    if (existing && existing.category === category) {
      next = { ...data, bookmarks: data.bookmarks.filter((b) => b.id !== existing.id) };
    } else if (existing) {
      next = { ...data, bookmarks: data.bookmarks.map((b) => (b.id === existing.id ? { ...b, category } : b)) };
    } else {
      next = { ...data, bookmarks: [...data.bookmarks, { id: uid(), entityType, entityId, label, category }] };
    }
    persist(next);
    setMenuOpen(false);
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        title="Bookmark"
        style={{
          background: existing ? C.navySoft : "transparent",
          border: `1px solid ${existing ? C.navy : C.border}`,
          borderRadius: 4,
          padding: "4px 9px",
          fontFamily: SANS,
          fontSize: 11.5,
          fontWeight: 600,
          color: existing ? C.navy : C.textSoft,
          cursor: "pointer",
        }}
      >
        {existing ? `★ ${existing.category}` : "☆ Bookmark"}
      </button>
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            zIndex: 20,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            boxShadow: "0 6px 18px rgba(20,20,30,0.12)",
            minWidth: 170,
            padding: 4,
          }}
        >
          {bookmarkCategories.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: existing && existing.category === c ? C.navySoft : "transparent",
                border: "none",
                padding: "6px 8px",
                fontFamily: SANS,
                fontSize: 12.5,
                color: C.text,
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------- LAW CARD ---------------------------- */

function LawCard({ lawId, data, persist, defaultLevel = 1 }) {
  const law = LAWS[lawId];
  const [level, setLevel] = useState(defaultLevel);
  if (!law) return null;
  const agencyNames = (law.agencies || []).map((a) => AGENCIES[a]?.short).filter(Boolean).join(", ");

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${authorityMeta[law.jurisdiction].color}`,
        borderRadius: 6,
        padding: "16px 18px",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div>
          <h3 style={{ fontFamily: SERIF, fontSize: 17.5, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>{law.name}</h3>
          <AuthorityBadges law={law} />
        </div>
        <BookmarkButton entityType="law" entityId={law.id} label={law.name} data={data} persist={persist} />
      </div>

      <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textSoft, lineHeight: 1.55, margin: "12px 0 8px" }}>{law.purpose}</p>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 4, columnGap: 10, fontFamily: SANS, fontSize: 12.5, marginTop: 10 }}>
        <span style={{ color: C.textFaint, fontWeight: 600 }}>Agency</span>
        <span style={{ color: C.text }}>{agencyNames || "—"}</span>
      </div>

      {level >= 2 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <SectionEyebrow>Level 2 — Framework</SectionEyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 6, columnGap: 10, fontFamily: SANS, fontSize: 12.5 }}>
            {law.statute && (
              <>
                <span style={{ color: C.textFaint, fontWeight: 600 }}>Statute</span>
                <span style={{ fontFamily: MONO, color: C.text }}>{law.statute}</span>
              </>
            )}
            {law.regulation && (
              <>
                <span style={{ color: C.textFaint, fontWeight: 600 }}>Regulation</span>
                <span style={{ fontFamily: MONO, color: C.text }}>{law.regulation}</span>
              </>
            )}
          </div>
          {law.level2?.coverage && (
            <p style={{ fontFamily: SANS, fontSize: 13, color: C.text, marginTop: 10, lineHeight: 1.55 }}>
              <strong style={{ color: C.textFaint, fontWeight: 700 }}>Coverage: </strong>
              {law.level2.coverage}
            </p>
          )}
          {law.level2?.obligations?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, fontWeight: 700 }}>Key obligations</span>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                {law.level2.obligations.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          )}
          {law.level2?.thresholds && (
            <div style={{ marginTop: 10, background: C.orangeSoft, border: `1px solid ${C.orange}22`, borderRadius: 4, padding: "8px 10px" }}>
              <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Thresholds / Numbers — Verify Before Use
              </span>
              <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.text, margin: "4px 0 0", lineHeight: 1.5 }}>{law.level2.thresholds}</p>
            </div>
          )}
        </div>
      )}

      {level >= 3 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <SectionEyebrow>Level 3 — Source Detail</SectionEyebrow>
          {law.level3?.forms?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, fontWeight: 700 }}>Forms</span>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                {law.level3.forms.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
          {law.level3?.guidance?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, fontWeight: 700 }}>Agency Guidance</span>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                {law.level3.guidance.map((g, i) => <li key={i}><Chip bg={C.tealSoft} fg={C.teal} small>Agency Guidance</Chip> &nbsp;{g}</li>)}
              </ul>
            </div>
          )}
          <div>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, fontWeight: 700 }}>Official Sources</span>
            <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontFamily: SANS, fontSize: 13, lineHeight: 1.6 }}>
              {law.officialSources.map((s, i) => (
                <li key={i}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.blue }}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
          {law.keyQuestions?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, fontWeight: 700 }}>Key HR Questions</span>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18, fontFamily: SANS, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                {law.keyQuestions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 11, color: C.textFaint }}>Last verified: {law.lastVerified}</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {level < 3 ? (
          <button
            onClick={() => setLevel(level + 1)}
            style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.navy, background: "none", border: `1px solid ${C.navy}44`, borderRadius: 4, padding: "5px 11px", cursor: "pointer" }}
          >
            {level === 1 ? "Show framework detail ▾" : "Show source detail ▾"}
          </button>
        ) : (
          <button
            onClick={() => setLevel(1)}
            style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.textSoft, background: "none", border: `1px solid ${C.border}`, borderRadius: 4, padding: "5px 11px", cursor: "pointer" }}
          >
            Collapse ▴
          </button>
        )}
      </div>

      <NotesPanel entityId={`law:${law.id}`} entityLabel={law.name} data={data} persist={persist} />
    </div>
  );
}

/* ---------------------------- SHARED: INTERSECTION LIST ---------------------------- */

function IntersectionList({ lawIds, data, persist, note }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Chip bg={C.orangeSoft} fg={C.orange}>Potentially Applicable — Verify Facts</Chip>
      </div>
      {note && <p style={{ fontFamily: SANS, fontSize: 13, color: C.textSoft, marginBottom: 14, lineHeight: 1.55 }}>{note}</p>}
      {lawIds.map((id) => (
        <LawCard key={id} lawId={id} data={data} persist={persist} />
      ))}
    </div>
  );
}

/* ---------------------------- VIEWS ---------------------------- */

function HomeView({ setView, data, persist }) {
  return (
    <div>
      <H1 sub="A personal, employer-agnostic reference for understanding how federal, state, and local law govern an H-2A / agricultural workforce — built to make a complex legal ecosystem finite, organized, and navigable.">
        H-2A Agricultural Workforce Navigator
      </H1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 30 }}>
        {[
          { v: "worker-types", t: "Who Is The Worker?", d: "Start here to classify the population you're dealing with." },
          { v: "topics", t: "What Issue Are You Dealing With?", d: "Navigate by practical HR issue — housing, wages, transportation, and more." },
          { v: "lifecycle", t: "Workforce Lifecycle", d: "Follow the employment relationship from planning through return travel." },
          { v: "ecosystem", t: "H-2A Legal Ecosystem", d: "See how the whole program connects across legal and operational areas." },
        ].map((c) => (
          <button
            key={c.v}
            onClick={() => setView(c.v)}
            style={{
              textAlign: "left",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "16px 16px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.navy)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 5 }}>{c.t}</div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.textSoft, lineHeight: 1.5 }}>{c.d}</div>
          </button>
        ))}
      </div>

      <SectionEyebrow>Legal Framework — Hierarchy</SectionEyebrow>
      <p style={{ fontFamily: SANS, fontSize: 13, color: C.textSoft, marginBottom: 16, maxWidth: 640, lineHeight: 1.55 }}>
        Not every issue has every layer below — a given HR question may only touch federal regulation and agency guidance, or it may also carry a state and local overlay.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
        <HierarchyColumn title="Federal" color={C.navy} steps={["Congress", "Federal Statute", "United States Code (U.S.C.)", "Code of Federal Regulations (CFR)", "Responsible / Enforcing Agency", "Agency Guidance", "Forms / Posters", "Operational HR Impact"]} />
        <HierarchyColumn title="State" color={C.blue} steps={["State Legislature", "State Statute", "State Administrative Rules", "State Agency", "Guidance / Forms", "Operational HR Impact"]} />
        <HierarchyColumn title="Local" color={C.teal} steps={["Local Ordinance / Code", "Local Authority", "Operational Impact"]} />
      </div>

      <Divider />
      <SectionEyebrow>Legal Source Labels — How To Read Every Card</SectionEyebrow>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        <Chip bg={C.navySoft} fg={C.navy}>Federal Statute</Chip>
        <Chip bg={C.navySoft} fg={C.navy}>Federal Regulation</Chip>
        <Chip bg={C.blueSoft} fg={C.blue}>State Statute</Chip>
        <Chip bg={C.blueSoft} fg={C.blue}>State Rule</Chip>
        <Chip bg={C.tealSoft} fg={C.teal}>Agency Guidance</Chip>
        <Chip bg={C.graySoft} fg={C.gray}>Company Procedure</Chip>
        <Chip bg={C.goldSoft} fg={C.gold}>Personal Note</Chip>
        <Chip bg={C.orangeSoft} fg={C.orange}>Needs Verification</Chip>
        <Chip bg={C.burgundySoft} fg={C.burgundy}>Legal Risk / Important</Chip>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, marginTop: 10, lineHeight: 1.5, maxWidth: 640 }}>
        Agency guidance is never presented as statutory language. Company procedure is never presented as a legal requirement. Personal notes are never presented as legal authority.
      </p>
    </div>
  );
}

function HierarchyColumn({ title, color, steps }) {
  return (
    <div>
      <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 10 }}>{title}</div>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ background: C.surface, border: `1px solid ${color}33`, borderRadius: 5, padding: "7px 10px", fontFamily: SANS, fontSize: 12.5, color: C.text }}>{s}</div>
          {i < steps.length - 1 && <ArrowDown />}
        </React.Fragment>
      ))}
    </div>
  );
}

function WorkerTypesView({ data, persist }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div>
      <H1 sub="Do not assume every agricultural worker is legally classified the same way. Start any new issue by identifying who you're actually dealing with.">Who Is The Worker?</H1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.values(WORKER_TYPES).map((w) => {
          const open = openId === w.id;
          return (
            <div key={w.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => setOpenId(open ? null : w.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ fontSize: 12, color: C.navy }}>{open ? "▾" : "▸"}</span>
                  <span style={{ fontFamily: SERIF, fontSize: 17.5, fontWeight: 600, color: C.text }}>{w.name}</span>
                </button>
                <BookmarkButton entityType="workerType" entityId={w.id} label={w.name} data={data} persist={persist} />
              </div>
              {open && (
                <div style={{ marginTop: 12 }}>
                  <FieldBlock label="Who Are They?">{w.who}</FieldBlock>
                  <FieldBlock label="Why The Classification Matters">{w.whyMatters}</FieldBlock>
                  <FieldBlock label="Key Distinctions">
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>{w.keyDistinctions.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </FieldBlock>
                  <div style={{ background: C.burgundySoft, border: `1px solid ${C.burgundy}22`, borderRadius: 4, padding: "8px 10px", margin: "10px 0" }}>
                    <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.burgundy, textTransform: "uppercase", letterSpacing: "0.04em" }}>Do Not Confuse With</span>
                    <p style={{ fontFamily: SANS, fontSize: 13, color: C.text, margin: "4px 0 0", lineHeight: 1.5 }}>{w.doNotConfuseWith}</p>
                  </div>
                  <SectionEyebrow>Potential Legal Frameworks</SectionEyebrow>
                  {w.frameworks.map((id) => <LawCard key={id} lawId={id} data={data} persist={persist} />)}
                  <NotesPanel entityId={`workerType:${w.id}`} entityLabel={w.name} data={data} persist={persist} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldBlock({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.textFaint, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.text, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function TopicsView({ data, persist, initialTopic }) {
  const [selected, setSelected] = useState(initialTopic || null);
  return (
    <div>
      <H1 sub="Select a practical issue. The navigator will not assume only one law applies — it will surface every potentially related framework so you can recognize intersections.">
        What Issue Are You Dealing With?
      </H1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {Object.values(TOPICS).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 20,
              border: `1px solid ${selected === t.id ? C.navy : C.border}`,
              background: selected === t.id ? C.navy : C.surface,
              color: selected === t.id ? "#fff" : C.text,
              cursor: "pointer",
            }}
          >
            {t.name}
          </button>
        ))}
      </div>
      {selected && (
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 20, color: C.navy, marginBottom: 4 }}>{TOPICS[selected].name}</h2>
          <IntersectionList lawIds={TOPICS[selected].laws} data={data} persist={persist} />
          <NotesPanel entityId={`topic:${selected}`} entityLabel={TOPICS[selected].name} data={data} persist={persist} />
        </div>
      )}
      {!selected && <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, fontStyle: "italic" }}>Select an issue above to see potentially related legal frameworks.</p>}
    </div>
  );
}

function EcosystemView({ setView }) {
  const areas = Object.values(TOPICS);
  return (
    <div>
      <H1 sub="An H-2A workforce interacts with multiple legal systems at once. Not every obligation originates in the H-2A regulations themselves.">H-2A Legal Ecosystem</H1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
        <div style={{ background: C.navy, color: "#fff", fontFamily: SERIF, fontSize: 16, fontWeight: 600, padding: "12px 26px", borderRadius: 8, textAlign: "center" }}>
          H-2A / Agricultural Workforce
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
        {areas.map((a) => (
          <button
            key={a.id}
            onClick={() => setView("topics", a.id)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderTop: `3px solid ${C.teal}`,
              borderRadius: 6,
              padding: "12px 14px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 700, color: C.text, marginBottom: 4 }}>{a.name}</div>
            <div style={{ fontFamily: SANS, fontSize: 11.5, color: C.textFaint }}>{a.laws.length} related framework{a.laws.length !== 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LifecycleView({ data, persist }) {
  const [openId, setOpenId] = useState(LIFECYCLE[0].id);
  return (
    <div>
      <H1 sub="Follow the employment relationship stage by stage. Each stage shows what happens, who may be involved, and which legal frameworks and agencies attach.">Workforce Lifecycle</H1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
        {LIFECYCLE.map((s, i) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => setOpenId(s.id)}
              style={{
                fontFamily: SANS,
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 5,
                border: `1px solid ${openId === s.id ? C.navy : C.border}`,
                background: openId === s.id ? C.navySoft : C.surface,
                color: openId === s.id ? C.navy : C.textSoft,
                cursor: "pointer",
              }}
            >
              {i + 1}. {s.name}
            </button>
          </React.Fragment>
        ))}
      </div>
      {LIFECYCLE.filter((s) => s.id === openId).map((s) => (
        <div key={s.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 19, color: C.navy, margin: "0 0 10px" }}>{s.name}</h2>
          <FieldBlock label="What Happens">{s.what}</FieldBlock>
          <FieldBlock label="Agencies">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {s.agencies.map((id) => <Chip key={id} bg={C.tealSoft} fg={C.teal} small>{AGENCIES[id]?.short}</Chip>)}
            </div>
          </FieldBlock>
          <FieldBlock label="HR Questions">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>{s.hrQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
          </FieldBlock>
          <SectionEyebrow>Legal Frameworks</SectionEyebrow>
          {s.laws.map((id) => <LawCard key={id} lawId={id} data={data} persist={persist} />)}
          <NotesPanel entityId={`lifecycle:${s.id}`} entityLabel={s.name} data={data} persist={persist} />
        </div>
      ))}
    </div>
  );
}

function AgencyView({ data, persist }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div>
      <H1 sub="Navigate by enforcing or administering agency. Jurisdiction is never invented — only agencies with a verified role in this framework are listed.">Agency Map</H1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.values(AGENCIES).map((a) => {
          const open = openId === a.id;
          return (
            <div key={a.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px" }}>
              <button onClick={() => setOpenId(open ? null : a.id)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 11, color: C.navy, marginRight: 8 }}>{open ? "▾" : "▸"}</span>
                    <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: C.text }}>{a.name}</span>
                  </div>
                  <Chip bg={C.tealSoft} fg={C.teal} small>{a.short}</Chip>
                </div>
              </button>
              {open && (
                <div style={{ marginTop: 10 }}>
                  <FieldBlock label="Role">{a.role}</FieldBlock>
                  <FieldBlock label="What Part Of The Workforce It Touches">{a.touches}</FieldBlock>
                  <FieldBlock label="Common HR Interaction">{a.interaction}</FieldBlock>
                  <a href={a.site} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: 12.5, color: C.blue }}>Official website ↗</a>
                  {a.laws.length > 0 && (
                    <>
                      <SectionEyebrow>Laws / Regulations Administered</SectionEyebrow>
                      {a.laws.map((id) => <LawCard key={id} lawId={id} data={data} persist={persist} />)}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JurisdictionView({ data, persist }) {
  const [tab, setTab] = useState("federal");
  const federalLaws = Object.values(LAWS).filter((l) => l.jurisdiction === "federal");
  const stateLaws = Object.values(LAWS).filter((l) => l.jurisdiction === "state");
  return (
    <div>
      <H1 sub="Federal and Minnesota requirements are not assumed to be identical. Overlaps are shown only where verified — most Minnesota entries here still need pinpoint citation work.">Federal vs. Minnesota vs. Local</H1>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["federal", "Federal"], ["state", "Minnesota"], ["local", "Local / Other"]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: 6,
              border: `1px solid ${tab === k ? C.navy : C.border}`,
              background: tab === k ? C.navy : C.surface,
              color: tab === k ? "#fff" : C.text,
              cursor: "pointer",
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {tab === "federal" && (
        <div>
          {federalLaws.map((l) => <LawCard key={l.id} lawId={l.id} data={data} persist={persist} />)}
        </div>
      )}
      {tab === "state" && (
        <div>
          <HierarchyColumn title="Minnesota" color={C.blue} steps={["Minnesota Legislature / Statutes", "Minnesota Administrative Rules", "Responsible State Agency", "Guidance / Forms", "Operational Impact"]} />
          <Divider />
          {stateLaws.map((l) => <LawCard key={l.id} lawId={l.id} data={data} persist={persist} />)}
        </div>
      )}
      {tab === "local" && (
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, fontStyle: "italic" }}>
          No local ordinances have been verified and added yet. Add them here as county or municipal requirements are researched and confirmed — the architecture reserves this space intentionally.
        </p>
      )}
    </div>
  );
}

function CorrespondingEmploymentView({ data, persist }) {
  const w = WORKER_TYPES["corresponding-employment"];
  return (
    <div>
      <H1 sub="Corresponding employment is not an immigration status. It is a job-order concept — do not treat it as equivalent to H-2A visa status.">Corresponding Employment</H1>
      <FieldBlock label="Definition">{w.who}</FieldBlock>
      <FieldBlock label="Why It Exists">
        The H-2A program requires that hiring foreign workers not adversely affect the wages and working conditions of workers similarly employed. Extending job-order terms to corresponding employment is how that protection is enforced in practice.
      </FieldBlock>
      <FieldBlock label="Who May Fall Within It">Existing domestic staff performing the same or substantially similar work as the certified job order, during the period it covers.</FieldBlock>
      <FieldBlock label="Why HR Must Identify It">Misclassifying who is or isn't in corresponding employment can create unequal pay or working conditions for workers doing the same job — a core H-2A compliance risk.</FieldBlock>
      <FieldBlock label="Potential Wage / Working Condition Connections">Wage rate parity, hours, and — depending on the job order — housing and transportation terms.</FieldBlock>
      <FieldBlock label="Common Confusion">Assuming corresponding employment requires an H-2A visa, or assuming it applies to any employee anywhere in the operation rather than only overlapping work.</FieldBlock>
      <SectionEyebrow>Related Frameworks</SectionEyebrow>
      {w.frameworks.map((id) => <LawCard key={id} lawId={id} data={data} persist={persist} />)}
      <NotesPanel entityId="workerType:corresponding-employment" entityLabel="Corresponding Employment" data={data} persist={persist} />
    </div>
  );
}

function MigrantSeasonalView({ data, persist }) {
  const migrant = WORKER_TYPES["migrant-ag-worker"];
  const seasonal = WORKER_TYPES["seasonal-ag-worker"];
  return (
    <div>
      <H1 sub="Migrant and seasonal agricultural worker are distinct, defined MSPA terms — keep these classifications legally separate from each other and from H-2A status.">
        Migrant &amp; Seasonal Agricultural Employment
      </H1>
      {[migrant, seasonal].map((w) => (
        <div key={w.id} style={{ marginBottom: 26 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 19, color: C.navy, marginBottom: 8 }}>{w.name}</h2>
          <FieldBlock label="Definition">{w.who}</FieldBlock>
          <FieldBlock label="Applicable Framework">MSPA is the primary framework; FLSA and EPA WPS apply in parallel regardless of MSPA status.</FieldBlock>
          <FieldBlock label="Relationship to H-2A">{w.doNotConfuseWith}</FieldBlock>
          <SectionEyebrow>Legal Frameworks</SectionEyebrow>
          {w.frameworks.map((id) => <LawCard key={`${w.id}-${id}`} lawId={id} data={data} persist={persist} />)}
          <NotesPanel entityId={`workerType:${w.id}`} entityLabel={w.name} data={data} persist={persist} />
        </div>
      ))}
    </div>
  );
}

const MATRIX_COLUMNS = ["recruitment", "wages", "housing", "transportation", "safety", "employment-verification", "discrimination", "termination-separation", "recordkeeping"];
const MATRIX_ROWS = ["h2a-worker", "corresponding-employment", "migrant-ag-worker", "seasonal-ag-worker", "domestic-ag-worker"];

function MatrixView({ data, persist }) {
  const [cell, setCell] = useState(null);

  function lawsForCell(rowId, colId) {
    const wLaws = new Set(WORKER_TYPES[rowId].frameworks);
    return TOPICS[colId].laws.filter((id) => wLaws.has(id));
  }

  return (
    <div>
      <H1 sub="Click a cell to see which legal frameworks potentially apply at that worker-type / issue intersection.">Legal Interaction Matrix</H1>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", fontFamily: SANS, fontSize: 12, minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ padding: "6px 8px", textAlign: "left" }}></th>
              {MATRIX_COLUMNS.map((c) => (
                <th key={c} style={{ padding: "6px 8px", fontSize: 11, color: C.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", textAlign: "left", borderBottom: `1px solid ${C.border}` }}>
                  {TOPICS[c].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_ROWS.map((r) => (
              <tr key={r}>
                <td style={{ padding: "6px 8px", fontWeight: 700, color: C.text, whiteSpace: "nowrap", borderRight: `1px solid ${C.border}` }}>{WORKER_TYPES[r].name}</td>
                {MATRIX_COLUMNS.map((c) => {
                  const count = lawsForCell(r, c).length;
                  const active = cell && cell.r === r && cell.c === c;
                  return (
                    <td key={c} style={{ padding: 4, textAlign: "center" }}>
                      <button
                        onClick={() => setCell(count > 0 ? { r, c } : null)}
                        disabled={count === 0}
                        style={{
                          width: 34,
                          height: 28,
                          borderRadius: 4,
                          border: `1px solid ${active ? C.navy : C.border}`,
                          background: count === 0 ? C.graySoft : active ? C.navy : C.navySoft,
                          color: count === 0 ? C.textFaint : active ? "#fff" : C.navy,
                          fontWeight: 700,
                          cursor: count === 0 ? "default" : "pointer",
                          fontSize: 12,
                        }}
                      >
                        {count || "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cell && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 18, color: C.navy, marginBottom: 4 }}>
            {WORKER_TYPES[cell.r].name} × {TOPICS[cell.c].name}
          </h2>
          <IntersectionList lawIds={lawsForCell(cell.r, cell.c)} data={data} persist={persist} />
        </div>
      )}
    </div>
  );
}

function interviewCopy(topic) {
  const lawNames = topic.laws.map((id) => LAWS[id]?.name).filter(Boolean);
  return {
    whatIManage: `Coordinating ${topic.name.toLowerCase()} across an agricultural workforce that includes H-2A workers, corresponding employment, and domestic staff.`,
    whyComplex: `${topic.name} isn't governed by a single rule — depending on who the worker is, it can touch ${lawNames.length} different legal framework${lawNames.length !== 1 ? "s" : ""} at once, each with its own agency and standard.`,
    intersection: lawNames.length ? lawNames.join("; ") : "Not yet populated — add verified frameworks to this topic first.",
    myRole: "Identifying which framework(s) apply to a given fact pattern, translating that into an operational process, and flagging anything that needs legal review before acting on it.",
    businessImpact: "Getting this right protects the company from wage claims, program debarment, and discrimination exposure — and protects workers from the underlying harm those rules exist to prevent.",
  };
}

function InterviewView({ data, persist }) {
  const [topicId, setTopicId] = useState(Object.keys(TOPICS)[0]);
  const topic = TOPICS[topicId];
  const copy = interviewCopy(topic);
  const entityId = `interview:${topicId}`;
  return (
    <div>
      <H1 sub="Not memorized answers — a way to articulate the real complexity of this work. The generated text below is a starting frame; add your own examples in Personal Notes below each topic.">
        Explain This In An Interview
      </H1>
      <select
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        style={{ fontFamily: SANS, fontSize: 13.5, padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 20, background: C.surface }}
      >
        {Object.values(TOPICS).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "18px 20px" }}>
        <FieldBlock label="What I Manage">{copy.whatIManage}</FieldBlock>
        <FieldBlock label="Why It Is Complex">{copy.whyComplex}</FieldBlock>
        <FieldBlock label="Legal / Regulatory Intersection">{copy.intersection}</FieldBlock>
        <FieldBlock label="My Role">{copy.myRole}</FieldBlock>
        <FieldBlock label="Business / Employee Impact">{copy.businessImpact}</FieldBlock>
        <div style={{ background: C.goldSoft, border: `1px solid ${C.gold}22`, borderRadius: 4, padding: "8px 10px", marginTop: 10 }}>
          <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.04em" }}>What I Learned</span>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: C.textFaint, margin: "4px 0 0", fontStyle: "italic" }}>Not generated for you — add your own experience below.</p>
        </div>
        <NotesPanel entityId={entityId} entityLabel={`${topic.name} — Interview Frame`} data={data} persist={persist} />
      </div>
    </div>
  );
}

function ComplexityMapView({ setView }) {
  return (
    <div>
      <H1 sub="The purpose of this map is to visually communicate professional scope — each branch expands into law, regulation, agency, and process.">Why H-2A HR Is Complex</H1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
        <div style={{ background: C.navy, color: "#fff", fontFamily: SERIF, fontSize: 17, fontWeight: 600, padding: "14px 28px", borderRadius: 8 }}>H-2A Workforce</div>
      </div>
      <ArrowDown />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12, marginTop: 8 }}>
        {Object.values(TOPICS).map((t) => {
          const primaryLaw = LAWS[t.laws[0]];
          return (
            <button
              key={t.id}
              onClick={() => setView("topics", t.id)}
              style={{ textAlign: "left", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "12px 14px", cursor: "pointer" }}
            >
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 8 }}>{t.name}</div>
              {primaryLaw && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontFamily: SANS, fontSize: 11, color: C.textFaint }}>
                  <span><strong style={{ color: C.textSoft }}>Law:</strong> {primaryLaw.name}</span>
                  {primaryLaw.regulation && <span><strong style={{ color: C.textSoft }}>Reg:</strong> {primaryLaw.regulation}</span>}
                  <span><strong style={{ color: C.textSoft }}>Agency:</strong> {AGENCIES[primaryLaw.agencies?.[0]]?.short}</span>
                  <span><strong style={{ color: C.textSoft }}>Process:</strong> {t.laws.length} framework{t.laws.length !== 1 ? "s" : ""} to reconcile operationally</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResourcesView({ data, persist }) {
  return (
    <div>
      <H1 sub="Prefer official government versions. This library links out rather than reproducing copyrighted or commercial materials.">Forms, Notices &amp; Posters</H1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {RESOURCES.map((r) => (
          <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: 15.5, color: C.text, margin: 0 }}>{r.name}</h3>
              <Chip bg={C.tealSoft} fg={C.teal} small>{AGENCIES[r.agency]?.short}</Chip>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 13, color: C.textSoft, margin: "6px 0" }}>{r.purpose}</p>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 3, columnGap: 10, fontFamily: SANS, fontSize: 12 }}>
              <span style={{ color: C.textFaint, fontWeight: 600 }}>Who needs it</span><span>{r.who}</span>
              <span style={{ color: C.textFaint, fontWeight: 600 }}>When used</span><span>{r.when}</span>
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SANS, fontSize: 12.5, color: C.blue }}>Official source ↗</a>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.textFaint }}>Last verified: {r.lastVerified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookmarksView({ data, persist, setView }) {
  const grouped = bookmarkCategories.map((cat) => ({ cat, items: data.bookmarks.filter((b) => b.category === cat) }));
  return (
    <div>
      <H1 sub="Bookmarks saved from anywhere in the navigator.">Bookmarks</H1>
      {grouped.every((g) => g.items.length === 0) && <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, fontStyle: "italic" }}>No bookmarks yet. Use the ☆ Bookmark button on any law, worker type, or agency card.</p>}
      {grouped.map((g) => g.items.length > 0 && (
        <div key={g.cat} style={{ marginBottom: 20 }}>
          <SectionEyebrow>{g.cat}</SectionEyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {g.items.map((b) => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 12px" }}>
                <span style={{ fontFamily: SANS, fontSize: 13, color: C.text }}>{b.label}</span>
                <button
                  onClick={() => {
                    if (b.entityType === "law") setView("law-lookup", b.entityId);
                    else if (b.entityType === "workerType") setView("worker-types");
                    else setView("agencies");
                  }}
                  style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: C.navy, background: "none", border: `1px solid ${C.navy}44`, borderRadius: 4, padding: "4px 9px", cursor: "pointer" }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LawLookupView({ data, persist, lawId }) {
  const law = LAWS[lawId];
  if (!law) return <p style={{ fontFamily: SANS, color: C.textFaint }}>Framework not found.</p>;
  return (
    <div>
      <H1>Framework Lookup</H1>
      <LawCard lawId={lawId} data={data} persist={persist} defaultLevel={3} />
    </div>
  );
}

function ResearchQueueView({ data, persist }) {
  const [draft, setDraft] = useState({ question: "", topic: "", potentialSource: "" });

  function addItem() {
    if (!draft.question.trim()) return;
    const item = { id: uid(), question: draft.question.trim(), topic: draft.topic.trim(), potentialSource: draft.potentialSource.trim(), status: "NOT RESEARCHED", answer: "", lastReviewed: "" };
    persist({ ...data, researchQueue: [...data.researchQueue, item] });
    setDraft({ question: "", topic: "", potentialSource: "" });
  }

  function updateItem(id, patch) {
    persist({ ...data, researchQueue: data.researchQueue.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  }

  function removeItem(id) {
    persist({ ...data, researchQueue: data.researchQueue.filter((i) => i.id !== id) });
  }

  const statusColor = { "NOT RESEARCHED": C.gray, RESEARCHING: C.orange, VERIFIED: C.teal, "NEEDS LEGAL REVIEW": C.burgundy };
  const statusSoft = { "NOT RESEARCHED": C.graySoft, RESEARCHING: C.orangeSoft, VERIFIED: C.tealSoft, "NEEDS LEGAL REVIEW": C.burgundySoft };

  return (
    <div>
      <H1 sub="Save open legal questions here rather than guessing in the moment. A few law cards above already flag items worth adding to this queue.">To Verify — Legal Research Queue</H1>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 22 }}>
        <SectionEyebrow>New Question</SectionEyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
            placeholder="e.g. Does this state rule apply to this housing arrangement?"
            style={{ fontFamily: SANS, fontSize: 13, padding: "8px 10px", borderRadius: 4, border: `1px solid ${C.border}` }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={draft.topic}
              onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
              placeholder="Topic (e.g. Housing)"
              style={{ flex: 1, fontFamily: SANS, fontSize: 13, padding: "8px 10px", borderRadius: 4, border: `1px solid ${C.border}` }}
            />
            <input
              value={draft.potentialSource}
              onChange={(e) => setDraft({ ...draft, potentialSource: e.target.value })}
              placeholder="Potential source"
              style={{ flex: 1, fontFamily: SANS, fontSize: 13, padding: "8px 10px", borderRadius: 4, border: `1px solid ${C.border}` }}
            />
          </div>
          <button onClick={addItem} style={{ alignSelf: "flex-start", fontFamily: SANS, fontSize: 12.5, fontWeight: 600, padding: "7px 16px", borderRadius: 4, border: "none", background: C.navy, color: "#fff", cursor: "pointer" }}>
            Add to Queue
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.researchQueue.length === 0 && <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.textFaint, fontStyle: "italic" }}>Nothing queued yet.</p>}
        {data.researchQueue.map((item) => (
          <div key={item.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${statusColor[item.status]}`, borderRadius: 6, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <p style={{ fontFamily: SANS, fontSize: 13.5, color: C.text, margin: 0, fontWeight: 600 }}>{item.question}</p>
              <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: C.textFaint, fontSize: 11, cursor: "pointer", fontFamily: SANS }}>remove</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8, fontFamily: SANS, fontSize: 12, color: C.textSoft }}>
              {item.topic && <span>Topic: <strong>{item.topic}</strong></span>}
              {item.potentialSource && <span>Source: <strong>{item.potentialSource}</strong></span>}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {queueStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateItem(item.id, { status: s, lastReviewed: new Date().toISOString().slice(0, 10) })}
                  style={{
                    fontFamily: SANS,
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 3,
                    border: `1px solid ${item.status === s ? statusColor[s] : C.border}`,
                    background: item.status === s ? statusSoft[s] : "transparent",
                    color: item.status === s ? statusColor[s] : C.textFaint,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(item.id, { answer: e.target.value })}
              placeholder="Answer / note once researched"
              rows={2}
              style={{ width: "100%", marginTop: 8, fontFamily: SANS, fontSize: 12.5, padding: "7px 9px", borderRadius: 4, border: `1px solid ${C.border}`, resize: "vertical" }}
            />
            {item.lastReviewed && <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.textFaint, marginTop: 4 }}>Last reviewed: {item.lastReviewed}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- SEARCH ---------------------------- */

function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results = [];
  Object.values(LAWS).forEach((l) => {
    const hay = [l.name, l.statute, l.regulation, l.purpose].join(" ").toLowerCase();
    if (hay.includes(q)) results.push({ type: "Legal Framework", id: l.id, label: l.name, view: "law-lookup", meta: AGENCIES[l.agencies?.[0]]?.short });
  });
  Object.values(TOPICS).forEach((t) => {
    if (t.name.toLowerCase().includes(q)) results.push({ type: "Issue", id: t.id, label: t.name, view: "topics", meta: `${t.laws.length} frameworks` });
  });
  Object.values(AGENCIES).forEach((a) => {
    if ((a.name + " " + a.short).toLowerCase().includes(q)) results.push({ type: "Agency", id: a.id, label: a.name, view: "agencies", meta: a.short });
  });
  Object.values(WORKER_TYPES).forEach((w) => {
    if ((w.name + " " + w.who).toLowerCase().includes(q)) results.push({ type: "Worker Type", id: w.id, label: w.name, view: "worker-types", meta: "" });
  });
  LIFECYCLE.forEach((s) => {
    if ((s.name + " " + s.what).toLowerCase().includes(q)) results.push({ type: "Lifecycle Stage", id: s.id, label: s.name, view: "lifecycle", meta: "" });
  });
  return results.slice(0, 20);
}

function SearchOverlay({ query, setQuery, onNavigate, onClose }) {
  const results = useMemo(() => searchAll(query), [query]);
  return (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 10px 30px rgba(20,20,30,0.15)", maxHeight: 380, overflowY: "auto", zIndex: 50 }}>
      {results.length === 0 && <div style={{ padding: 16, fontFamily: SANS, fontSize: 13, color: C.textFaint }}>{query ? "No matches." : "Type to search topics, laws, agencies, worker types, and lifecycle stages."}</div>}
      {results.map((r) => (
        <button
          key={r.type + r.id}
          onClick={() => {
            onNavigate(r.view, r.id);
            onClose();
          }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, padding: "10px 14px", cursor: "pointer" }}
        >
          <div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.text, fontWeight: 600 }}>{r.label}</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.textFaint }}>{r.type}{r.meta ? ` · ${r.meta}` : ""}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ---------------------------- NAV / SHELL ---------------------------- */

const NAV = [
  { section: "Start", items: [["home", "Home"], ["worker-types", "Who Is The Worker?"], ["topics", "What Issue?"]] },
  { section: "Maps & Views", items: [["ecosystem", "H-2A Legal Ecosystem"], ["lifecycle", "Workforce Lifecycle"], ["agencies", "Agency Map"], ["jurisdiction", "Federal / Minnesota / Local"], ["matrix", "Legal Interaction Matrix"], ["complexity", "Why H-2A HR Is Complex"]] },
  { section: "Dedicated Topics", items: [["corresponding", "Corresponding Employment"], ["migrant-seasonal", "Migrant / Seasonal Employment"]] },
  { section: "Resources", items: [["resources", "Forms, Notices & Posters"], ["interview", "Explain This In An Interview"]] },
  { section: "My Workspace", items: [["bookmarks", "Bookmarks"], ["research-queue", "To Verify"]] },
];

export default function App() {
  const { data, loaded, saveError, persist } = useNavigatorData();
  const [view, setViewRaw] = useState("home");
  const [viewParam, setViewParam] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setView = (v, param) => {
    setViewRaw(v);
    setViewParam(param || null);
    setMobileNavOpen(false);
  };

  let content;
  if (view === "home") content = <HomeView setView={setView} data={data} persist={persist} />;
  else if (view === "worker-types") content = <WorkerTypesView data={data} persist={persist} />;
  else if (view === "topics") content = <TopicsView data={data} persist={persist} initialTopic={viewParam} key={viewParam} />;
  else if (view === "ecosystem") content = <EcosystemView setView={setView} />;
  else if (view === "lifecycle") content = <LifecycleView data={data} persist={persist} />;
  else if (view === "agencies") content = <AgencyView data={data} persist={persist} />;
  else if (view === "jurisdiction") content = <JurisdictionView data={data} persist={persist} />;
  else if (view === "matrix") content = <MatrixView data={data} persist={persist} />;
  else if (view === "complexity") content = <ComplexityMapView setView={setView} />;
  else if (view === "corresponding") content = <CorrespondingEmploymentView data={data} persist={persist} />;
  else if (view === "migrant-seasonal") content = <MigrantSeasonalView data={data} persist={persist} />;
  else if (view === "resources") content = <ResourcesView data={data} persist={persist} />;
  else if (view === "interview") content = <InterviewView data={data} persist={persist} />;
  else if (view === "bookmarks") content = <BookmarksView data={data} persist={persist} setView={setView} />;
  else if (view === "research-queue") content = <ResearchQueueView data={data} persist={persist} />;
  else if (view === "law-lookup") content = <LawLookupView data={data} persist={persist} lawId={viewParam} />;

  return (
    <div style={{ fontFamily: SANS, background: C.bg, minHeight: "100vh", color: C.text }}>
      {/* Header */}
      <div style={{ background: C.navy, color: "#fff", padding: "10px 20px", display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 40 }}>
        <button
          onClick={() => setMobileNavOpen((o) => !o)}
          style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}
          className="nav-toggle"
        >
          ☰
        </button>
        <div style={{ fontFamily: SERIF, fontSize: 15.5, fontWeight: 600, letterSpacing: "0.01em", whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => setView("home")}>
          H-2A Navigator
        </div>
        <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search housing, MSPA, I-9, transportation…"
            style={{ width: "100%", fontFamily: SANS, fontSize: 13, padding: "7px 12px", borderRadius: 6, border: "none", outline: "none" }}
          />
          {searchOpen && (
            <SearchOverlay
              query={query}
              setQuery={setQuery}
              onNavigate={(v, id) => setView(v, id)}
              onClose={() => {
                setSearchOpen(false);
                setQuery("");
              }}
            />
          )}
        </div>
        {saveError && <Chip bg={C.orangeSoft} fg={C.orange} small>Browser storage unavailable — changes won't be saved on this device</Chip>}
      </div>

      <div style={{ display: "flex", maxWidth: 1180, margin: "0 auto" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 232,
            flexShrink: 0,
            padding: "20px 14px",
            borderRight: `1px solid ${C.border}`,
            minHeight: "calc(100vh - 46px)",
            display: mobileNavOpen ? "block" : undefined,
          }}
          className="sidebar"
        >
          {NAV.map((sec) => (
            <div key={sec.section} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.textFaint, padding: "0 10px 6px" }}>{sec.section}</div>
              {sec.items.map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: view === v ? C.navySoft : "transparent",
                    color: view === v ? C.navy : C.textSoft,
                    border: "none",
                    borderRadius: 5,
                    padding: "7px 10px",
                    fontFamily: SANS,
                    fontSize: 13,
                    fontWeight: view === v ? 700 : 500,
                    cursor: "pointer",
                    marginBottom: 1,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "26px 28px 80px", minWidth: 0 }}>
          {!loaded ? (
            <p style={{ fontFamily: SANS, fontSize: 13, color: C.textFaint }}>Loading your saved notes and bookmarks…</p>
          ) : (
            content
          )}
        </div>
      </div>

      {/* Persistent disclaimer footer */}
      <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: `1px solid ${C.border}`, padding: "8px 20px", fontFamily: SANS, fontSize: 10.5, color: C.textFaint, lineHeight: 1.5, zIndex: 30 }}>
        This navigator is an educational and operational reference tool. It does not provide legal advice and does not replace review of current statutes, regulations, agency guidance, company policy, collective bargaining agreements, or consultation with qualified legal/compliance professionals. Requirements may change and applicability depends on specific facts.
        &nbsp;Do not enter employee medical information, Social Security numbers, immigration document numbers, passport information, or other sensitive personal information.
      </div>

      <style>{`
        @media (max-width: 820px) {
          .sidebar { display: none; position: fixed; top: 46px; left: 0; bottom: 0; background: ${C.bg}; z-index: 35; overflow-y: auto; box-shadow: 4px 0 16px rgba(0,0,0,0.12); }
          .nav-toggle { display: inline-block !important; }
        }
        input:focus { outline: 2px solid ${C.blue}; }
        button:focus-visible { outline: 2px solid ${C.blue}; outline-offset: 1px; }
        a { text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
