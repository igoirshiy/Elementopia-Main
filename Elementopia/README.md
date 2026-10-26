# Elementopia: An Interactive Gamified Chemistry Learning Platform

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203%20%7C%20Java%2017-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployment](https://img.shields.io/badge/Frontend%20Host-Vercel-black?logo=vercel&logoColor=white)](https://elementopia-game.vercel.app)
[![Backend Host](https://img.shields.io/badge/Backend%20Host-Render%20(Docker)-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Capstone](https://img.shields.io/badge/CIT--U%20Capstone-2627--sem1--it411--53-800000)](https://cit.edu/)

> **Cebu Institute of Technology – University | College of Computer Studies**  
> **Course / Section:** Bachelor of Science in Information Technology / `2627-sem1-it411-53` (formerly `2526-sem2-it332-53`)  
> **Capstone Adviser:** Engr. Ralph P. Laviste  
> **Live Staging Application:** [https://elementopia-game.vercel.app](https://elementopia-game.vercel.app)  
> **Repository:** [https://github.com/igoirshiy/Elementopia-Main](https://github.com/igoirshiy/Elementopia-Main)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Pedagogical & Research Framework](#2-pedagogical--research-framework)
3. [Core Modules & Refactored Features (v2.0)](#3-core-modules--refactored-features-v20)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Repository Structure](#6-repository-structure)
7. [Local Development & Setup Guide](#7-local-development--setup-guide)
8. [Environment Configuration](#8-environment-configuration)
9. [Deployment Information](#9-deployment-information)
10. [Testing & Quality Assurance](#10-testing--quality-assurance)
11. [Project Team & Attribution](#11-project-team--attribution)

---

## 1. Project Overview

**Elementopia** is an interactive, web-based gamified educational platform engineered to transform abstract high school chemistry concepts—specifically **DepEd Grade 9 Chemical Bonding (Ionic and Covalent Bonding)**—into immersive, problem-solving gameplay. 

Traditional chemistry instruction in secondary schools frequently relies on static 2D textbook diagrams and rote memorization of chemical formulas, leaving students unable to conceptualize subatomic electron interactions. Elementopia addresses these pedagogical shortcomings by replacing static multiple-choice drills with:
* An active **drag-and-drop synthesis workbench** governed by real-time stoichiometric validation rules;
* Contextual **Meaningful Byproduct** diagnostic alerts and anti-guessing failsafes;
* Two-tier **pedagogical debriefing modals** connecting gameplay actions to formal chemical bonding theory;
* Frictionless, zero-registration onboarding via temporary guest nicknames; and
* Real-time peer-to-peer **1v1 competitive challenges** under latency-resilient network protocols.

---

## 2. Pedagogical & Research Framework

Elementopia’s architecture is grounded in a triangulated educational research framework:
1. **Keller's ARCS Model of Motivational Design:** Evaluates psychological engagement across four core constructs:
   * **Attention (OBJ-01):** Sustained via interactive workbench animations, obstacle clearance, and $< 15\%$ idle rate.
   * **Relevance (OBJ-02):** Established through real-world compound utility, meaningful byproduct explanations, and DepEd curriculum alignment.
   * **Confidence (OBJ-03):** Nurtured through intelligent scaffolding, progressive room difficulties, and the Hazmat Protocol anti-guessing lock ($\le 3$ failed attempts per stage).
   * **Satisfaction (OBJ-04):** Fostered via the visual Mastery Dashboard and fair Speed-to-Compound 1v1 challenges ($\ge 4.20/5.00$ satisfaction threshold).
2. **Bloom's Revised Taxonomy & Hake's Normalized Learning Gain ($g$):** Measures verifiable cognitive gains between pre-test diagnostic baselines and post-test evaluations ($g \ge 0.40$ target benchmark).
3. **TPACK & UPA Frameworks:** Incorporates expert validation from licensed secondary science educators to ensure scientific accuracy, curriculum fidelity, and classroom viability.

---

## 3. Core Modules & Refactored Features (v2.0)

### Module 1: Elemental Resonance Puzzle Module
* **Stoichiometric Synthesis Workbench (FR-1.1):** Drag-and-drop element combination engine enforcing valence electron pairing rules and animating obstacle clearances.
* **Meaningful Byproduct Diagnostic Feedback (FR-1.2):** Generates scientifically accurate explanations when invalid element combinations yield real-world chemical byproducts.
* **Hazmat Protocol Anti-Guessing Failsafe (FR-1.3):** Sliding-window algorithm that temporarily disables workbench element tiles for 15 seconds upon detecting 5 rapid invalid attempts within 15 seconds.
* **Dr. Atom's Reaction Workshop (FR-1.4):** Interactive reference compendium displaying element properties, valence counts, and real-world compound applications.
* **Post-Stage & Post-Domain Educational Debrief (FR-1.6 - Refactored):**
  * *Intermediate Stages (1 & 2):* `StageTransitionModal.jsx` displays Dr. Atom's commentary, a checklist of unlocked masteries, and an upcoming blueprint preview.
  * *Final Domain Clearance (Stage 3):* `DebriefingModal.jsx` displays the full 12-compound recap, completion accuracy %, elapsed time, and core bonding theory (polar/nonpolar covalent vs. ionic transfer).

### Module 2: Assessment and Progress Module
* **Real-Time Session Telemetry (FR-2.1):** Automatically logs attempt frequencies, completion times, and error patterns into Supabase cloud persistence within $< 2.0$ seconds.
* **Visual Mastery Dashboard (FR-2.2):** Interactive analytics hub rendering radar charts, progress bars, and historical performance breakdowns to facilitate self-directed learning.
* **Centralized Diagnostic Pre-Test Cloud Sync (FR-2.4 - Refactored):** Asynchronously dispatches pre-test baseline scores via `POST /api/telemetry/pretest` directly into the Supabase `PRETEST_DIAGNOSTIC` table, guaranteeing 100% cloud pairing for automated learning gain ($g$) computation.

### Module 3: Opponent-Based Challenge Module (Speed-to-Compound)
* **Real-Time Matchmaking Lobby (FR-3.1):** 5-digit room code matchmaking connecting peers in under 5 seconds via Supabase Realtime WebSocket channels.
* **Synchronized Competition Engine (FR-3.2 & FR-3.3):** Real-time race to synthesize target chemical compounds with sub-second synchronization.
* **Realtime Heartbeat & Disconnect Engine (FR-3.4 - Refactored):** Emits bidirectional 3-second heartbeat pings. An 8-second silence triggers `DISCONNECTED_GRACE` (pausing match countdown and rendering a 15-second reconnection modal); unrecovered disconnects automatically award a `FORFEIT_WIN`, eliminating frozen game screens.

### Non-Functional Usability Standard (NFR-USA-01)
* **Mobile Touch Target Bounds:** Enforces minimum 48px $\times$ 48px interactive touch boundaries and mobile-optimized CSS grid layouts, eliminating mobile drag-and-drop mis-clicks on 360px–768px viewports.

---

## 4. System Architecture

Elementopia operates on a modern, decoupled **Three-Tier Architecture**:

```
+-------------------------------------------------------------------------+
|                         PRESENTATION TIER (CLIENT)                      |
|  React 19 + Vite + TailwindCSS v4 | HTML5 Canvas / Konva | Recharts     |
|  - GameBoard.jsx (Synthesis Engine)    - PreTestModal.jsx (Diagnostics) |
|  - StageTransitionModal / DebriefModal - ChallengeArena.jsx (1v1 Match) |
+------------------------------------+------------------------------------+
                                     | HTTPS REST (Async) & WebSockets
                                     v
+-------------------------------------------------------------------------+
|                        APPLICATION / LOGIC TIER                         |
|  Spring Boot 3.x (Java 17) [Render / Docker]                            |
|  - PreTestTelemetryController.java  - ReactionController.java           |
|  - HeartbeatTimeoutHandler.js       - ChallengeController.java          |
|  - SlidingWindowEvaluationService   - FeedbackLibraryService            |
+------------------------------------+------------------------------------+
                                     | Connection Pooling (HikariCP / SSL)
                                     v
+-------------------------------------------------------------------------+
|                            DATA STORAGE TIER                            |
|  Supabase Cloud (PostgreSQL 15) & Supabase Realtime                     |
|  - PRETEST_DIAGNOSTIC (Baselines)   - USER_SESSION_TELEMETRY (Gameplay) |
|  - MATCH_HEARTBEAT_STATE            - COMPOUND_BLUEPRINTS               |
+-------------------------------------------------------------------------+
```

---

## 5. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React.js | `^19.0.0` | Component-based reactive user interface |
| **Build Tool** | Vite | `^6.0.0` | Fast HMR dev server and optimized production bundler |
| **Styling** | TailwindCSS | `^4.3.0` | Utility-first responsive styling and animations |
| **Drag & Drop** | `@dnd-kit/core` | `^6.3.1` | Mobile-touch compatible drag-and-drop mechanics |
| **Canvas Graphics**| Konva / React-Konva | `^9.3.20` | Dynamic chemical bond visualization and particle effects |
| **Data Viz** | Recharts | `^2.15.2` | Visual Mastery Dashboard charts and progress radar |
| **Backend API** | Spring Boot | `3.x` | RESTful API endpoints and business logic controllers |
| **Language** | Java (Eclipse Temurin)| `17` | Server-side runtime environment |
| **Build Tool** | Apache Maven | `3.8+` | Dependency management and JAR packaging (`mvnw`) |
| **Database** | PostgreSQL (Supabase) | `15` | Relational cloud database for telemetry and match state |
| **Realtime Sync** | Supabase Realtime | `^2.106.2` | WebSocket broadcast for 1v1 multiplayer matchmaking |
| **Frontend Host** | Vercel | Production | High-availability global edge hosting with SPA rewrites |
| **Backend Host** | Render | Docker | Containerized Spring Boot cloud service |

---

## 6. Repository Structure

```
Elementopia-Main/
├── .github/                       # CI/CD automation workflows
├── Documents/                     # Official Capstone Documentation
│   ├── Elementopia_MVP_Validation_Findings_and_Refactoring_Priorities_Form.docx
│   ├── Elementopia_MVP_Validation_Findings_and_Refactoring_Priorities_Form.md
│   ├── Elementopia_Refactored_SRS_v2.0.docx
│   ├── Elementopia_Refactored_SDD_v2.0.docx
│   └── Elementopia_Midterm_Requirements_and_Action_Plan.docx
├── Elementopia/
│   ├── BACKEND/                   # Spring Boot 3 Java 17 Service
│   │   ├── src/main/java/         # Controllers, Services, Models, Repositories
│   │   ├── src/main/resources/    # application.properties (Datasource configs)
│   │   ├── Dockerfile             # Eclipse Temurin 17 container build specification
│   │   ├── render.yaml            # Render cloud deployment blueprint
│   │   ├── mvnw / mvnw.cmd        # Cross-platform Maven wrapper scripts
│   │   └── pom.xml                # Backend dependencies and plugins
│   ├── FRONTEND/                  # React 19 + Vite Application
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── resonance-puzzle/    # Synthesis workbench, debrief modals
│   │   │   │   ├── mastery-dashboard/   # Telemetry charts and progress view
│   │   │   │   ├── 1v1-challenge/       # Realtime multiplayer arena
│   │   │   │   └── dr-atom-workshop/    # Chemical element compendium
│   │   │   ├── components/              # Shared UI components (Tiles, Buttons)
│   │   │   ├── services/                # Supabase client, REST API clients
│   │   │   └── App.jsx                  # Route definitions and session provider
│   │   ├── .env.example           # Client environment template
│   │   ├── vercel.json            # Vercel SPA rewrite routing rules
│   │   ├── vite.config.js         # Vite bundler plugins and path aliases
│   │   └── package.json           # Frontend dependencies and scripts
│   ├── start-backend.bat          # Windows one-click backend launch script
│   └── start-frontend.bat         # Windows one-click frontend launch script
├── README.md                      # Master repository documentation
└── package-lock.json
```

---

## 7. Local Development & Setup Guide

### Prerequisites
Before running the system locally, ensure your machine has:
* **Node.js:** `v18.x` or `v20.x` LTS ([Download Node.js](https://nodejs.org/))
* **Java Development Kit (JDK):** Version 17 or higher ([Eclipse Temurin 17](https://adoptium.net/))
* **Git:** Installed and configured ([Download Git](https://git-scm.com/))
* **Browser:** Modern Chromium, Firefox, or Safari browser

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/igoirshiy/Elementopia-Main.git
cd Elementopia-Main
```

---

### Step 2: Configure Environment Variables
Navigate to the frontend directory and create your local `.env` file:
```bash
cd Elementopia/FRONTEND
cp .env.example .env
```
Open `.env` and verify the configuration:
```env
VITE_SUPABASE_URL=https://ywwcsnxcetcsvdzxclts.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_API_URL=http://localhost:8080
```

---

### Step 3: Run the Frontend Application
In the `Elementopia/FRONTEND` directory:
```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```
The client application will start at: **`http://localhost:5173`**

---

### Step 4: Run the Backend Application
Open a new terminal and navigate to `Elementopia/BACKEND`:
```bash
# On Linux/macOS:
./mvnw clean spring-boot:run

# On Windows (Command Prompt / PowerShell):
.\mvnw.cmd clean spring-boot:run
```
The Spring Boot REST API will initialize at: **`http://localhost:8080`**

---

### Windows Quick-Start Scripts
For convenience on Windows workstations, double-click the bundled shortcut scripts in the `Elementopia/` directory:
1. Run **`start-backend.bat`** (automatically detects JDK 21/22/17 and launches Spring Boot).
2. Run **`start-frontend.bat`** (navigates to `FRONTEND/` and launches `npm run dev`).

---

## 8. Environment Configuration

### Frontend Environment Variables (`Elementopia/FRONTEND/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase project REST & Realtime URL | `https://*.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client anon key for DB operations | `eyJhbGciOi...` |
| `VITE_API_URL` | Backend Spring Boot API base URL | `http://localhost:8080` (Local) / Render URL (Staging) |

### Backend Environment Properties (`Elementopia/BACKEND/src/main/resources/application.properties`)
| Property | Environment Variable Override | Description |
| :--- | :--- | :--- |
| `spring.datasource.url` | `SPRING_DATASOURCE_URL` or `DATABASE_URL` | PostgreSQL JDBC connection URL |
| `spring.datasource.username` | `SPRING_DATASOURCE_USERNAME` | Supabase pooled database user |
| `spring.datasource.password` | `SPRING_DATASOURCE_PASSWORD` | Supabase database access password |
| `server.port` | `PORT` | Spring Boot HTTP listening port (Default: `8080`) |

---

## 9. Deployment Information

### Live Staging Environments
* **Frontend Application:** [https://elementopia-game.vercel.app](https://elementopia-game.vercel.app)
* **GitHub Repository:** [https://github.com/igoirshiy/Elementopia-Main](https://github.com/igoirshiy/Elementopia-Main)

---

### Frontend Deployment (Vercel)
The React application is continuously deployed via Vercel connected to the `Elementopia-Main` GitHub repository:
* **Framework Preset:** Vite
* **Root Directory:** `Elementopia/FRONTEND`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Single Page Application (SPA) Rewrites (`vercel.json`):**
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/"
      }
    ]
  }
  ```

---

### Backend Deployment (Render via Docker)
The Spring Boot backend is containerized and hosted on Render:
* **Environment:** Docker
* **Configuration:** `Elementopia/BACKEND/render.yaml`
* **Dockerfile Build Pipeline:**
  ```dockerfile
  FROM eclipse-temurin:17-jdk
  WORKDIR /app
  COPY . .
  RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests
  CMD ["java", "-jar", "target/Gamified-0.0.1-SNAPSHOT.jar"]
  ```

---

### Database Deployment (Supabase PostgreSQL)
* **Hosting:** AWS Asia Pacific (Singapore) `ap-southeast-1`
* **Pooling:** Transaction pooler enabled on port `5432` with HikariCP connection bounds (`maximum-pool-size=5`, `max-lifetime=60000ms`).
* **SSL Requirement:** Enforced via `sslmode=require`.

---

## 10. Testing & Quality Assurance

### Verification Test Cases
The system is validated against the following formal test cases:
* **TC-M1-01:** Stoichiometric combination and barrier clearance in the Elemental Resonance puzzle room.
* **TC-M1-03:** Hazmat Protocol failsafe trigger (disabling workbench for 15 seconds after 5 rapid invalid reactions).
* **TC-M1-06 (Refactored):** Verification of `StageTransitionModal.jsx` and `DebriefingModal.jsx` milestone rendering and chemistry theory review.
* **TC-M2-01:** Verification of automated session telemetry logging into Supabase within $< 2.0$ seconds.
* **TC-M2-04 (Refactored):** Centralized diagnostic pre-test cloud sync latency verification (`POST /api/telemetry/pretest`).
* **TC-M3-01:** Peer-to-peer 5-digit room matchmaking connection established in $< 5.0$ seconds.
* **TC-M3-04 (Refactored):** Realtime heartbeat disconnect test (8s silence detection, 15s grace countdown modal, automated forfeit victory resolution).
* **TC-NFR-01 (Refactored):** Mobile touch target viewport compliance ($\ge 48\text{px} \times 48\text{px}$) across 360px–768px resolutions.

### Running Automated Checks
```bash
# Frontend Code Linting:
cd Elementopia/FRONTEND
npm run lint

# Backend Unit and Integration Tests:
cd Elementopia/BACKEND
./mvnw test
```

---

## 11. Project Team & Attribution

### Capstone Development Team (Group 53)
* **Danielle Maxine P. Ocampo** — Project Manager & Lead Software Engineer
* **Clyde C. Benolirao** — Full Stack Developer & Gameplay Systems Engineer
* **Jian Marc Ceniza** — Backend Engineer & Database Architect
* **Erica Y. Dabalos** — Frontend Developer & UI/UX Specialist
* **Wayne Kenji B. Dibdib** — QA Engineer & Telemetry Specialist

### Capstone Adviser
* **Engr. Ralph P. Laviste** — College of Computer Studies, Cebu Institute of Technology – University

### Academic Validation Partners
* **Casay National High School** — Secondary Science Department (Student End-Users & Faculty SMEs)
* **Tisa National High School** — Secondary Science Department (Student End-Users & Faculty SMEs)

### Attribution to Original Prototype Contributors
* Rey Mar Segalle
* Mark Edwin Huyo-a
* Jericho Sam Dollano
* Miguel Antonio Dakay
* Abram John Hortezano
* Kent Bausin

---

© 2026 Team Elementopia | Cebu Institute of Technology – University. All Rights Reserved.
