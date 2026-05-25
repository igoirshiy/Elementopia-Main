const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

// Define the exact new locations for files
const fileMoves = [
  // Images
  { old: 'src/assets/img', new: 'src/assets/images', isDir: true },
  { old: 'src/components/student-components/robot.avif', new: 'src/assets/images/robot.avif' },
  { old: 'src/components/student-components/robot.svg', new: 'src/assets/images/robot.svg' },
  
  // Styles
  { old: 'src/elementopia/elementopia.css', new: 'src/assets/styles/global/elementopia.css' },
  { old: 'src/student/ElementMatcher.css', new: 'src/assets/styles/pages/ElementMatcher.css' },
  { old: 'src/student/StudentCardMinigame.css', new: 'src/assets/styles/pages/StudentCardMinigame.css' },
  { old: 'src/assets/css', new: 'src/assets/styles/legacy', isDir: true },

  // Data
  { old: 'src/student/achievements.json', new: 'src/data/achievements.json' },
  { old: 'src/components/student-components/achievements.json', new: 'src/data/achievements.json' }, // Will overwrite if duplicate

  // Pages -> Auth
  { old: 'src/student/login-card.jsx', new: 'src/pages/auth/LoginCard.jsx' },
  { old: 'src/student/register-card.jsx', new: 'src/pages/auth/RegisterCard.jsx' },

  // Pages -> Public
  { old: 'src/student/LandingPage.jsx', new: 'src/pages/public/LandingPage.jsx' },
  { old: 'src/student/about-us.jsx', new: 'src/pages/public/AboutUs.jsx' },

  // Pages -> Student
  { old: 'src/student/StudentHomePage.jsx', new: 'src/pages/student/StudentHomePage.jsx' },
  { old: 'src/student/StudentSandboxPage.jsx', new: 'src/pages/student/StudentSandboxPage.jsx' },
  { old: 'src/student/StudentStateChanges.jsx', new: 'src/pages/student/StudentStateChanges.jsx' },
  { old: 'src/student/StudentCardMinigame.jsx', new: 'src/pages/student/StudentCardMinigame.jsx' },
  { old: 'src/student/StudentDiscoveryPage.jsx', new: 'src/pages/student/StudentDiscoveryPage.jsx' },
  { old: 'src/student/StudentElementMatcher.jsx', new: 'src/pages/student/StudentElementMatcher.jsx' },
  { old: 'src/student/ElementMatcher.jsx', new: 'src/pages/student/ElementMatcher.jsx' },
  { old: 'src/student/ElementopiaGame.jsx', new: 'src/pages/student/ElementopiaGame.jsx' },

  // Components -> Common
  { old: 'src/components/NavBar.jsx', new: 'src/components/common/NavBar.jsx' },
  { old: 'src/components/Sidebar.jsx', new: 'src/components/common/Sidebar.jsx' },
  { old: 'src/components/buttons.jsx', new: 'src/components/common/Buttons.jsx' },
  { old: 'src/components/featurecard.jsx', new: 'src/components/common/FeatureCard.jsx' },
  { old: 'src/components/footer.jsx', new: 'src/components/common/Footer.jsx' },
  { old: 'src/components/navigation.jsx', new: 'src/components/common/Navigation.jsx' },

  // Components -> Student
  { old: 'src/components/student-components', new: 'src/components/student', isDir: true }
];

// Helper to create directories
function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Execute all moves
for (const move of fileMoves) {
  const oldPath = path.join(__dirname, move.old);
  const newPath = path.join(__dirname, move.new);
  
  if (fs.existsSync(oldPath)) {
    ensureDirExists(newPath);
    fs.renameSync(oldPath, newPath);
    console.log(`Moved: ${move.old} -> ${move.new}`);
  }
}

// Rename elementopia dir to delete later since elementopia.css moved
if (fs.existsSync(path.join(SRC_DIR, 'elementopia')) && fs.readdirSync(path.join(SRC_DIR, 'elementopia')).length === 0) {
  fs.rmdirSync(path.join(SRC_DIR, 'elementopia'));
}

// 2. We need a mapping from the old filename to the new absolute import path using `@/`
// E.g., 'NavBar' -> '@/components/common/NavBar'
const importMap = {
  // Images
  '../assets/img/': '@/assets/images/',
  '../../assets/img/': '@/assets/images/',
  './assets/img/': '@/assets/images/',
  '../assets/img/home.png': '@/assets/images/home.png',
  '../assets/img/career.png': '@/assets/images/career.png',
  '../assets/img/discovery.png': '@/assets/images/discovery.png',
  '../assets/img/chemSimulation.png': '@/assets/images/chemSimulation.png',
  './robot.svg': '@/assets/images/robot.svg',
  './robot.avif': '@/assets/images/robot.avif',
  '../img/': '@/assets/images/',
  
  // Data
  './achievements.json': '@/data/achievements.json',
  '../student/achievements.json': '@/data/achievements.json',

  // CSS
  '../assets/css/': '@/assets/styles/legacy/',
  '../../assets/css/': '@/assets/styles/legacy/',
  './ElementMatcher.css': '@/assets/styles/pages/ElementMatcher.css',
  './StudentCardMinigame.css': '@/assets/styles/pages/StudentCardMinigame.css',
  '@/elementopia/elementopia.css': '@/assets/styles/global/elementopia.css',

  // Components -> Common
  '../components/NavBar': '@/components/common/NavBar',
  '../components/Sidebar': '@/components/common/Sidebar',
  '../components/buttons': '@/components/common/Buttons',
  '../components/featurecard': '@/components/common/FeatureCard',
  '../components/footer': '@/components/common/Footer',
  '../components/navigation': '@/components/common/Navigation',

  // Components -> Student
  '../components/student-components/': '@/components/student/',
  './student-components/': '@/components/student/',

  // Pages -> Auth
  './student/login-card': '@/pages/auth/LoginCard',
  './student/register-card': '@/pages/auth/RegisterCard',

  // Pages -> Public
  './student/LandingPage': '@/pages/public/LandingPage',
  './student/about-us': '@/pages/public/AboutUs',

  // Pages -> Student
  './student/StudentHomePage': '@/pages/student/StudentHomePage',
  './student/StudentSandboxPage': '@/pages/student/StudentSandboxPage',
  './student/StudentStateChanges': '@/pages/student/StudentStateChanges',
  './student/StudentCardMinigame': '@/pages/student/StudentCardMinigame',
  './student/StudentDiscoveryPage': '@/pages/student/StudentDiscoveryPage',
  './student/StudentElementMatcher': '@/pages/student/StudentElementMatcher',
  './student/ElementMatcher': '@/pages/student/ElementMatcher',
  './student/ElementopiaGame': '@/pages/student/ElementopiaGame',
  
  // Fix imports from moving pages out of student/
  '../components/elementopia/': '@/components/elementopia/',
  '../lib/': '@/lib/',
  '../services/': '@/services/',
  '../../services/': '@/services/',
  '../components/': '@/components/',
  './login-card': '@/pages/auth/LoginCard',
  './register-card': '@/pages/auth/RegisterCard',
  './about-us': '@/pages/public/AboutUs',
  '@/components/Sidebar': '@/components/common/Sidebar',
  '@/components/NavBar': '@/components/common/NavBar',
  '../student/login-card': '@/pages/auth/LoginCard',
  '../student/register-card': '@/pages/auth/RegisterCard',
  '../student/about-us': '@/pages/public/AboutUs'
};

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(SRC_DIR);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Extremely robust search and replace for imports
  for (const [oldImp, newImp] of Object.entries(importMap)) {
    // Escape regex characters just in case
    const safeOld = oldImp.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    
    // We want to replace paths inside quotes in import statements
    const regex1 = new RegExp(`from\\s+['"]${safeOld}['"]`, 'g');
    const regex2 = new RegExp(`from\\s+['"]${safeOld}(.*?)['"]`, 'g');
    const regex3 = new RegExp(`import\\s+['"]${safeOld}['"]`, 'g');
    const regex4 = new RegExp(`import\\s+['"]${safeOld}(.*?)['"]`, 'g');

    content = content.replace(regex1, `from '${newImp}'`);
    content = content.replace(regex3, `import '${newImp}'`);
    
    // If it's a directory replacement (like '../assets/css/')
    if (oldImp.endsWith('/')) {
       content = content.replace(regex2, `from '${newImp}$1'`);
       content = content.replace(regex4, `import '${newImp}$1'`);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in: ${file}`);
  }
}

console.log("Refactoring complete.");
