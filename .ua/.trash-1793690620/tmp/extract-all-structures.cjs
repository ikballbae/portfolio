const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const pluginRoot = "C:\\Users\\Akhma\\.understand-anything\\repo\\understand-anything-plugin";
const skillDir = path.join(pluginRoot, "skills", "understand");
const extractScript = path.join(skillDir, "extract-structure.mjs");

const batchesData = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/batches.json', 'utf8'));

for (const batch of batchesData.batches) {
  const idx = batch.batchIndex;
  const inputFile = `c:/project/portfolio/.ua/tmp/ua-file-analyzer-input-${idx}.json`;
  const outputFile = `c:/project/portfolio/.ua/tmp/ua-file-extract-results-${idx}.json`;

  const inputData = {
    projectRoot: "c:/project/portfolio",
    batchFiles: batch.files,
    batchImportData: batch.batchImportData
  };
  fs.writeFileSync(inputFile, JSON.stringify(inputData, null, 2));

  console.log(`Running extract-structure for batch ${idx}...`);
  try {
    execSync(`node "${extractScript}" "${inputFile}" "${outputFile}"`, {
      env: { ...process.env, PLUGIN_ROOT: pluginRoot },
      stdio: 'inherit'
    });
    console.log(`Batch ${idx} extraction complete.`);
  } catch (err) {
    console.error(`Error in batch ${idx}:`, err.message);
  }
}
console.log('All extractions complete.');
