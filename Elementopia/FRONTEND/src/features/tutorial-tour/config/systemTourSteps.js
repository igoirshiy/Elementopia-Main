export const SYSTEM_TOUR_STEPS = [
  {
    id: "welcome-hub",
    target: '[data-tour="tour-welcome"]',
    category: "COMMAND CENTER",
    title: "Welcome to Elementopia!",
    description: "This is your central Alchemist Command Hub. Track your cleared elemental domains, overall synthesis accuracy, and time spent in the lab.",
    tip: "Your progress is permanently saved to your Mastery Profile as you play.",
    icon: "Sparkles",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "alchemist-stats",
    target: '[data-tour="tour-stats"]',
    category: "MASTERY METRICS",
    title: "Live Laboratory Analytics",
    description: "Monitor your domain clearances, precision rating, and hazmat activations. High accuracy unlocks prestigious alchemical milestones!",
    tip: "Aim for 80%+ accuracy across all domains to become a Master Alchemist.",
    icon: "BarChart3",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "periodic-matrix",
    target: '[data-tour="tour-matrix"]',
    category: "CORE MODULE",
    title: "The Periodic Matrix",
    description: "Inspect all 118 authentic elements of the universe! Filter by element families (Alkali, Halogens, Noble Gases) and analyze atomic mass and electron configurations.",
    tip: "Click on any element tile to open its deep structural profile.",
    icon: "Grid",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "dr-atom-workshop",
    target: '[data-tour="tour-workshop"]',
    category: "INTERACTIVE ACADEMY",
    title: "Dr. Atom's Workshop",
    description: "Learn chemistry fundamentals with Dr. Atom! Master the 8-electron octet rule, explore Bohr atomic models, and see how atoms share valence electrons to form bonds.",
    tip: "Complete these lessons first to master chemical bonding before puzzle missions.",
    icon: "Wrench",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "compound-gallery",
    target: '[data-tour="tour-gallery"]',
    category: "ENCYCLOPEDIA",
    title: "Compound Gallery",
    description: "Browse 50+ real-world chemical compounds. Reveal molecular synthesis recipes, explore 3D molecular structures, and learn everyday scientific trivia.",
    tip: "Every new compound you synthesize in the Sandbox gets cataloged here.",
    icon: "Image",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "chemistry-sandbox",
    target: '[data-tour="tour-sandbox"]',
    category: "LAB SIMULATION",
    title: "Chemistry Sandbox",
    description: "Your open-ended chemical workbench! Freely drag elements from the shelf into the mixing beaker, trigger synthesis reactions, and discover new molecules.",
    tip: "Try combining 2x Hydrogen with 1x Oxygen to synthesize Water (H₂O)!",
    icon: "FlaskConical",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "opponent-challenge",
    target: '[data-tour="tour-challenge"]',
    category: "MULTIPLAYER 1v1",
    title: "Opponent Challenge Arena",
    description: "Ready to test your speed? Generate a 5-digit room code, challenge a classmate or friend, and race in real-time to synthesize the target molecule first!",
    tip: "Both players race live on the same molecular puzzle target.",
    icon: "Swords",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "sidebar-menu",
    target: '[data-tour="tour-menu"]',
    category: "NAVIGATION",
    title: "Quick Navigation & Discoveries",
    description: "Open the navigation menu from anywhere to instantly switch between modules or view your Discoveries Codex — your personal achievement archive.",
    tip: "You can click this menu button from any screen in the system.",
    icon: "Menu",
    position: "bottom",
    route: "/student-home-page"
  },
  {
    id: "resonance-campaign",
    target: '[data-tour="tour-domains"]',
    category: "CORE CAMPAIGN",
    title: "Resonance Puzzle Arena",
    description: "Begin your elemental journey! Enter Domain 1: Carbon to solve atomic riddles, balance live electron shells, and stabilize elemental cores.",
    tip: "Clear each domain to unlock higher tiers and become a Master of Elements!",
    icon: "Zap",
    position: "top",
    route: "/student-home-page"
  }
];
