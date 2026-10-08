# Elementopia: MVP Validation, Refactoring, & Deliverables Master Checklist

This master action plan addresses the consultation feedback, course deliverable guidelines, and methodological improvements for **Elementopia (Capstone Project: 2526-sem2-it332-53)**.

---

## 📅 Milestones & Deliverables Roadmap

```
MVP Validation Package (Framework, Highlights, Responses, Evidence)
   └──► Booking & Attending Validation Results Consultation
          └──► Submitting Refactoring Priorities Form
                 └──► Submitting Refactored SRS (with RTM), SDD, & SPMP
                        └──► Software Test Documents (STD) & Cloud Deployment
```

---

## 📋 Phase 1: Instrument & Data Collection Improvements

### 1.1 Preserve Existing Student Data
- [x] **Preserve `Elementopia (Validation Responses).xlsx`**: Retain the 30 existing high school student responses as the primary dataset for **Student User Experience & Technology Acceptance (UEQ / TAM)**.
- [ ] **Categorize the 20 Likert Items**: Formally map the existing questions in the paper to the standardized UEQ dimensions (*Attractiveness, Perspicuity, Efficiency, Dependability, Stimulation*) and TAM (*Perceived Usefulness, Behavioral Intention*).

### 1.2 Implement the Formative Student Skill Probe
- [ ] **Add Section 3 (Skill Diagnostic Check) to the Student Instrument**:
  - [ ] **Item S1 (Bond Type Discrimination):** *"When synthesizing Table Salt (NaCl) by combining Sodium (Na) and Chlorine (Cl), what type of chemical bond is formed?"* `[Ionic (electron transfer) | Covalent (electron sharing) | Metallic]`
  - [ ] **Item S2 (Stoichiometry & Valence):** *"In the Cavern workbench, how many Hydrogen (H) atoms were required to combine with Oxygen (O) to synthesize Water (H2O)?"* `[1 | 2 | 3 | 4]`
  - [ ] **Item S3 (Conceptual Error Recovery):** *"When a 'Byproduct Alert' triggered, did the feedback explain why the reaction failed (e.g., incompatible valence or incorrect ratio)?"* `[Yes, guided me to the right element | No, I guessed]`
- [ ] **Collect Diagnostic Responses**: Administer the 3-item probe to a target sample (15–30 students) or integrate it directly at the end of cavern runs.

### 1.3 Create and Administer the Teacher / SME Evaluation Form
- [ ] **Create the Teacher Evaluation Form (Google Form or Rubric)** based on **TPACK** and the **UPA (Usability, Pedagogy, Accessibility)** framework.
- [ ] **Include Core Teacher Evaluation Questions (1–5 Likert Scale):**
  - [ ] **T1 (Curriculum Alignment):** *"The chemical elements, valence rules, and compounds featured in Elementopia align with Grade 9 and Grade 10 DepEd Science curriculum competencies (Chemical Bonding, Periodic Table)."*
  - [ ] **T2 (Scientific Accuracy):** *"The chemical formulas, reaction behaviors, and byproduct explanations presented in the game are scientifically accurate and free of conceptual errors."*
  - [ ] **T3 (Instructional Scaffolding):** *"The progression mechanic (requiring basic Element Rooms to be cleared before unlocking advanced Compound Chambers) provides sound pedagogical scaffolding for students."*
  - [ ] **T4 (Intervention Efficacy):** *"The 'Meaningful Byproduct' micro-lessons and Hazmat failsafe (disabling irrelevant elements after repeated failures) effectively discourage blind guessing and promote guided problem-solving."*
  - [ ] **T5 (Classroom Viability):** *"Elementopia would serve as an effective, complementary gamified review tool alongside traditional classroom chemistry instruction."*
  - [ ] **T6 (Qualitative Recommendations):** *"What chemistry concepts or features should be refined, added, or removed to make this more effective for high school learners?"*
- [ ] **Administer to 2 to 3 Subject Matter Experts**: Distribute to High School Chemistry / Science teachers (e.g., CIT-U High School science faculty or former high school chemistry instructors) to establish **content and curriculum validity**.

---

## 📋 Phase 2: Official MVP Validation Deliverables (Course Requirements)

### 2.1 Deliverable 1: Google Form – Validation Instrument
- [ ] **Verify Form Structure**: Ensure the Google Form contains:
  - [ ] Student UX & Usability Section (20 items mapped to UEQ/TAM).
  - [ ] Student Skill Diagnostic Section (3 formative chemistry items).
  - [ ] Subject Matter Expert (Teacher) Section or separate linked form.
  - [ ] Open-ended feedback fields for qualitative suggestions.
- [ ] **Verify Form Accessibility**: Ensure permissions allow public/evaluator access via link.

### 2.2 Deliverable 2: PDF – Validation Framework / Model Document
- [ ] **Identify and Justify Frameworks**:
  - [ ] **UEQ & TAM**: For student user experience, engagement, and behavioral adoption.
  - [ ] **UPA Framework / TPACK**: For expert pedagogical and curriculum validity.
  - [ ] **GQM (Goal–Question–Metric)**: For connecting automated telemetry to SMART objectives.
- [ ] **Include Construct Mapping Matrix**:
  - [ ] Map each SMART objective to its corresponding evaluation constructs.
  - [ ] Group questionnaire items by construct and respondent role (Student vs. Teacher/SME).
- [ ] **Export & Format**: Generate clean, professional PDF named `Elementopia_Validation_Framework.pdf`.

### 2.3 Deliverable 3: Google Sheet – Validation Responses
- [ ] **Ensure Data Organization**: Verify that `Elementopia (Validation Responses).xlsx` (or linked Google Sheet) has all columns labeled, timestamps recorded, and consent fields confirmed.
- [ ] **Link Teacher Responses**: Include the Teacher/SME evaluation responses in a dedicated tab (`Teacher SME Responses`).

### 2.4 Deliverable 4: PDF – MVP Validation Highlights Document
- [ ] **Compile Quantitative Results**: Summarize mean scores (e.g., Overall UX = 4.22/5.0; Drag-and-drop workbench = 4.40; 1v1 multiplayer satisfaction = 4.27).
- [ ] **Document Critical Findings & Gaps Honestly**:
  - [ ] **Finding A (Curriculum Alignment Dip):** Survey Q6 scored 3.77 (lowest), revealing that certain in-game compounds diverge from high school syllabus topics.
  - [ ] **Finding B (Obstacle Causality):** Survey Q9 scored 3.97, showing students wanted clearer chemistry-based justification for obstacle clearing.
  - [ ] **Finding C (Skill Validation Gap):** Absence of objective pre/post cognitive validation beyond subjective student opinion.
  - [ ] **Finding D (Session Persistence):** Session data fragility when nicknames change or during offline play.
- [ ] **Synthesize Qualitative Highlights**: Summarize student praise for the 1v1 duel challenge and requests for clearer reaction explanations.
- [ ] **Outline Refactoring Directives**: Clearly define what the team will refactor based on these findings.
- [ ] **Export & Format**: Generate PDF named `Elementopia_MVP_Validation_Highlights.pdf`.

### 2.5 Deliverable 5: Google Drive Folder – Validation Evidence
- [ ] **Create Shared Drive Folder**: Ensure link permissions are set to *"Anyone with the link can view."*
- [ ] **Upload Required Evidence**:
  - [ ] Screenshots of the working deployed MVP (Resonance workbench, Byproduct popups, Hazmat graying, Mastery Dashboard, 1v1 Lobby).
  - [ ] Photos/screenshots of students actively testing the platform.
  - [ ] Consultation notes, meeting logs, and consent records.

---

## 📋 Phase 3: Validation Results Consultation & Requirements Refactoring

### 3.1 Book & Attend MVP Validation Results Consultation
- [ ] **Book Consultation Slot**: Reserve a schedule on the Capstone Home Page booking link.
- [ ] **Prepare Consultation Pitch**:
  - [ ] Acknowledge the "faulty vs. fully optimized" dilemma honestly (explaining how the team analyzed the data beyond superficial positive ratings).
  - [ ] Present the Highlights PDF, highlighting both successes and the Q6/Q9 gaps.
  - [ ] Pitch the 4 Refactoring Priorities.
- [ ] **Secure Official Clearance**: Obtain adviser approval to proceed to Requirements Refactoring.

### 3.2 Submit Requirements and Design Refactoring Priorities Form
- [ ] **Address the 5 Required Questions for Each Priority**:
  1. *What did you learn from the MVP validation?*
  2. *What stakeholder feedback or evidence supports the finding?*
  3. *Which SMART objective or measurable outcome is affected?*
  4. *What aspect of the requirements or design should be improved?*
  5. *How is the proposed change expected to improve the measurable outcome?*
- [ ] **Priority 1: DepEd Grade 9/10 Curriculum Alignment** (Refactoring `elements-data.js` and `ReactionController.java` to fix the Q6 3.77 gap).
- [ ] **Priority 2: Chemical Reaction Causality & Byproduct Feedback** (Refactoring obstacle descriptions and byproduct micro-lessons to fix the Q9 3.97 gap).
- [ ] **Priority 3: Post-Cavern Formative Skill Diagnostic Probe** (Adding in-game skill validation and Teacher SME rubrics to validate learning).
- [ ] **Priority 4: Device UUID Session Persistence** (Refactoring `UserService.jsx` and local storage to prevent session data loss).

---

## 📋 Phase 4: Specification Updates (Updated SRS, SDD, SPMP)

### 4.1 Refactored SRS (Software Requirements Specification)
- [ ] **Update Functional Requirements**: Add requirements for the Post-Cavern Skill Probe, updated DepEd compound pool, and UUID session persistence.
- [ ] **Create Requirements Traceability Matrix (RTM)**:
  - [ ] Map each Project Objective $\rightarrow$ User Requirement $\rightarrow$ Functional Requirement $\rightarrow$ Test Case ID.
  - [ ] Embed the RTM into Section 4/5 of the updated SRS.

### 4.2 Refactored SDD (Software Design Description)
- [ ] **Update Component Descriptions**: Update `ReactionController.java`, `GameBoard.jsx`, and `UserService.jsx` descriptions to reflect refactored logic.
- [ ] **Update Sequence & Activity Diagrams**: Reflect the 3-question skill probe workflow and the persistent UUID session check.

### 4.3 Refactored SPMP (Software Project Management Plan)
- [ ] **Update Project Schedule & Gantt Chart**: Reflect current Week 9–10 testing and deployment timelines.
- [ ] **Update Risk Management Matrix**: Add risk mitigations for teacher evaluation availability and online deployment stability.

---

## 📋 Phase 5: Software Test Documents (STD) & Deployment

### 5.1 Software Test Documents (STD)
- [ ] **Draft Software Test Plan (STP)**: Define test scope, test environment, test pass/fail criteria, and schedules.
- [ ] **Draft Test Cases (STC)**:
  - [ ] **Module 1 (Resonance Puzzle):** Drag-and-drop validation, compound synthesis correctness, Hazmat sliding window (5 fails in 15 seconds disables invalid tiles).
  - [ ] **Module 2 (Mastery Dashboard):** Supabase telemetry logging latency ($< 2\text{s}$), room clear badge updates, accuracy calculations.
  - [ ] **Module 3 (Opponent Challenge):** 5-digit room creation/join latency ($< 5\text{s}$), Realtime state sync, Speed-to-Compound winner determination accuracy.
- [ ] **Execute Tests & Generate Test Reports (STR)**: Record actual execution outcomes, defect logs, and pass percentages.

### 5.2 System Pilot/Production Deployment
- [ ] **Deploy Frontend**: Host on Vercel, Netlify, or cloud platform.
- [ ] **Deploy Backend**: Host Spring Boot on Render, Railway, or VPS with connected Supabase PostgreSQL instance.
- [ ] **Verify Live Access**: Test public URL on both desktop and mobile viewports.
- [ ] **Compile Usability Test Results**: Format validation metrics into final submission report.

---

*Checklist created for Team Elementopia (2526-sem2-it332-53). Update checkboxes as tasks are completed.*
