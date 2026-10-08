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
    id: "sidebar-menu",
    target: '[data-tour="tour-menu"]',
    category: "NAVIGATION",
    title: "Quick Navigation & Interactive Modules",
    description: "Open the navigation menu from anywhere to instantly access all interactive modules: Periodic Matrix, Dr. Atom's Workshop, Compound Gallery, Chemistry Sandbox, Discoveries Codex, and 1v1 Challenges!",
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
    description: "Begin your elemental journey! Enter the elemental caverns to solve atomic riddles, balance live electron shells, and stabilize elemental cores.",
    tip: "Clear each domain to unlock higher tiers and become a Master of Elements!",
    icon: "Zap",
    position: "top",
    route: "/student-home-page"
  }
];
