export const WORKSHOP_SLIDES = [
  {
    id: 1,
    title: "1. Boxes & Symbols",
    subtitle: "Welcome! Each box here is an <strong>element</strong>. Letters like <strong>H</strong> and <strong>He</strong> are their Chemical Symbols (like a nickname). The number of <em>protons</em> tells you the <em>Atomic Number</em>!",
    visualizerType: "bohr",
    defaultElement: 1,
    highlightType: "elements",
    highlightTargets: [1, 2],
    actions: [
      { label: "🔋 Show H (1 Proton)", elementNum: 1 },
      { label: "🔋 Show He (2 Protons)", elementNum: 2 }
    ]
  },
  {
    id: 2,
    title: "2. Reading a Tile",
    subtitle: "Look at this tile close-up! Click the different parts of the Carbon box below to see what each number and letter represents!",
    visualizerType: "anatomy",
    highlightType: "elements",
    highlightTargets: [6],
  },
  {
    id: 3,
    title: "3. Columns = Groups",
    subtitle: "Vertical columns are called <strong>groups</strong>. Sibling elements in the same column share the same number of outer valence electrons ('hands') for chemical bonding!",
    visualizerType: "groups",
    highlightType: "group",
    highlightTargets: [1],
    actions: [
      { label: "Group 1 (1 Hand)", groupNum: 1 },
      { label: "Group 17 (7 Hands)", groupNum: 17 },
      { label: "Group 18 (8 Hands)", groupNum: 18 }
    ]
  },
  {
    id: 4,
    title: "4. Rows = Periods",
    subtitle: "Horizontal rows are called <strong>periods</strong>. The row number tells you exactly how many electron rings (shells) the atom possesses around its nucleus!",
    visualizerType: "periods",
    highlightType: "period",
    highlightTargets: [1],
    actions: [
      { label: "Row 1 (1 Ring)", periodNum: 1 },
      { label: "Row 2 (2 Rings)", periodNum: 2 },
      { label: "Row 3 (3 Rings)", periodNum: 3 }
    ]
  },
  {
    id: 5,
    title: "5. Atom Size (Radius)",
    subtitle: "How big is an atom? Down the columns, they get <strong>bigger</strong> (adding rings). But left-to-right, they get <strong>smaller</strong>! Why? Because adding more protons acts like a stronger magnet, pulling the rings inward!",
    visualizerType: "trend-radius",
    highlightType: "size-trend",
  },
  {
    id: 6,
    title: "6. Electron Grip",
    subtitle: "How hard does an atom grip its outer electrons? Left-to-right, the grip gets stronger because the atom's 'tractor beam' (electronegativity) gets more powerful! Down the columns, it gets weaker because outer electrons are further away.",
    visualizerType: "trend-ionization",
    highlightType: "grip-trend",
  },
  {
    id: 7,
    title: "7. Bonding Theater",
    subtitle: "Let's see synthesis in action! Click 'Play Animation' below to watch Sodium and Chlorine transfer electrons and form an ionic bond!",
    visualizerType: "bonding-theater",
    highlightType: "elements",
    highlightTargets: [11, 17],
  },
  {
    id: 8,
    title: "8. Summary: The Golden Rule",
    subtitle: "Let's wrap up! The secret to chemistry is that every atom just wants to be completely stable like a Noble Gas with a full outer electron shell (the Rule of 8)!",
    visualizerType: "bonding-rule-summary",
    highlightType: "elements",
    highlightTargets: [2, 10, 18, 36, 54, 86, 118],
  }
];
