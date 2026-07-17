import fs from 'fs';
import path from 'path';

const CATALOG = {
  '@replit/vite-plugin-cartographer': '^0.5.21',
  '@replit/vite-plugin-dev-banner': '^0.1.1',
  '@replit/vite-plugin-runtime-error-modal': '^0.0.6',
  '@tailwindcss/vite': '^4.1.14',
  '@tanstack/react-query': '^5.90.21',
  '@types/node': '^25.3.3',
  '@types/react': '^19.2.0',
  '@types/react-dom': '^19.2.0',
  '@vitejs/plugin-react': '^5.0.4',
  'class-variance-authority': '^0.7.1',
  'clsx': '^2.1.1',
  'drizzle-orm': '^0.45.2',
  'framer-motion': '^12.23.24',
  'lucide-react': '^0.545.0',
  'react': '19.1.0',
  'react-dom': '19.1.0',
  'tailwind-merge': '^3.3.1',
  'tailwindcss': '^4.1.14',
  'tsx': '^4.21.0',
  'vite': '^7.3.2',
  'wouter': '^3.3.5',
  'zod': '^3.25.76'
};

function getPackageJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getPackageJsonFiles(filePath, fileList);
      }
    } else if (file === 'package.json') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const rootDir = process.cwd();
const files = getPackageJsonFiles(rootDir);

console.log(`Found ${files.length} package.json files. Processing...`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let json;
  try {
    json = JSON.parse(content);
  } catch (err) {
    console.error(`Error parsing ${file}:`, err.message);
    continue;
  }

  let modified = false;
  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  for (const section of sections) {
    if (json[section]) {
      for (const [dep, val] of Object.entries(json[section])) {
        if (val === 'catalog:') {
          if (CATALOG[dep]) {
            json[section][dep] = CATALOG[dep];
            modified = true;
            console.log(`Resolved: ${dep} -> ${CATALOG[dep]} in ${path.relative(rootDir, file)}`);
          } else {
            console.warn(`Warning: No version found in catalog for ${dep} in ${file}`);
          }
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log(`Updated: ${path.relative(rootDir, file)}`);
  }
}

console.log('Catalog resolution completed successfully.');
