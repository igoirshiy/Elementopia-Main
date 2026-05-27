# Capstone-Elementopia
Capstone Project: 2526-sem2-it332-53

# 1. Introduction
Elementopia is an interactive, web-based gamified learning platform that transforms complex chemistry concepts into engaging adventures for high school students. It is developed using React.js for the frontend, SpringBoot for the backend, and Supabase (PostgreSQL) for persistent session data storage and real-time synchronization.

# 1.1 Purpose
The purpose of this project is to address the limitations of existing quiz-based chemistry platforms by extending the original Elementopia system. It introduces three new modules:
1. **Elemental Resonance Puzzle Module:** Environmental puzzle rooms where students synthesize compounds to clear obstacles.
2. **Assessment and Progress Module:** Automated session performance logging and a visual Mastery Dashboard for self-directed knowledge gap identification.
3. **Opponent-Based Challenge Module:** Real-time peer-to-peer matchmaking and Speed-to-Compound evaluation.

# 1.2 Scope
The platform targets high school students who struggle with traditional text-heavy chemistry instruction. The functional scope is strictly bounded to the three modules mentioned above, designed to develop applied chemistry knowledge and algorithmic thinking through interactive visual problem-solving. The platform maintains mobile responsiveness and does not require user registration (bypassing traditional authentication via temporary session nicknames).

# 1.3 Definitions, Acronyms and Abbreviations
-  SRS: Software Requirements Specification
-  UI/UX: User Interface/User Experience
-  PostgreSQL: Relational Database Management System (via Supabase)
-  Agile: A software development methodology
-  KPIs: Key Performance Indicators

# Current Developers (Extension Team)
- Ocampo, Danielle Maxine P.
- Benolirao, Clyde C.
- Ceniza, Jian Marc
- Dabalos, Erica Y.
- Dibdib, Wayne Kenji B.

# Original Developers
- Rey Mar Segalle
- Mark Edwin Huyo-a
- Jericho Sam Dollano
- Miguel Antonio Dakay
- Abram John Hortezano
- Kent Bausin (Contributor)

# How to Run Locally (For the Team)

### Prerequisites:
- **Node.js** installed (for the frontend).
- **Java 17 or higher** installed and added to your system `PATH` (for the backend).

### Step 1: Clone the Repository
Run the following command in your terminal:
`git clone https://github.com/igoirshiy/Elementopia-Main.git`

### Step 2: Install Frontend Dependencies
1. Open a terminal and type: `cd Elementopia/FRONTEND`
2. Run: `npm install`

### Step 3: Run the Application!
We have created two shortcut batch scripts to easily run the servers.
1. Open the `Elementopia` root folder.
2. Double-click **`start-backend.bat`** (or run `.\start-backend.bat` in terminal) to start the Spring Boot server.
3. Double-click **`start-frontend.bat`** (or run `.\start-frontend.bat` in terminal) to start the React UI.

> **Note:** If the backend fails saying `JAVA_HOME not found`, make sure you have Java installed and set up correctly in your system environment variables.
