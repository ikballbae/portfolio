const fs = require('fs');

const scanFiles = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/tmp/ua-scan-files.json', 'utf8'));
const importMapData = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/tmp/ua-import-map-output.json', 'utf8'));

const scanResult = {
  name: "myportfolio",
  description: "Aplikasi web portofolio personal interaktif yang dibangun dengan Next.js (App Router), React, Tailwind CSS, animasi Framer Motion & GSAP, serta backend Supabase untuk sistem blog dan komentar.",
  languages: ["css", "javascript", "json", "markdown", "python", "typescript"],
  frameworks: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "GSAP", "Supabase"],
  files: scanFiles.files,
  totalFiles: scanFiles.totalFiles,
  filteredByIgnore: scanFiles.filteredByIgnore,
  estimatedComplexity: scanFiles.estimatedComplexity,
  importMap: importMapData.importMap
};

fs.writeFileSync('c:/project/portfolio/.ua/intermediate/scan-result.json', JSON.stringify(scanResult, null, 2));
console.log('scan-result.json written successfully. Total files:', scanResult.totalFiles);
