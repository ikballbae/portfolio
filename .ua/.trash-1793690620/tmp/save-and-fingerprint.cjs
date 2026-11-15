const fs = require('fs');
const path = require('path');

const uaDir = 'c:/project/portfolio/.ua';
const intermediateDir = path.join(uaDir, 'intermediate');

// Step 1: write final knowledge-graph.json
const assembled = JSON.parse(fs.readFileSync(path.join(intermediateDir, 'assembled-graph.json'), 'utf8'));
fs.writeFileSync(path.join(uaDir, 'knowledge-graph.json'), JSON.stringify(assembled, null, 2));
console.log('Step 1: knowledge-graph.json saved.');

// Step 2: prepare fingerprint input
const scanResult = JSON.parse(fs.readFileSync(path.join(intermediateDir, 'scan-result.json'), 'utf8'));
const filePaths = scanResult.files.map(f => f.path);

const fingerprintInput = {
  projectRoot: "c:/project/portfolio",
  filePaths: filePaths,
  gitCommitHash: "71113c7ffdef2b698538d51e2449227748ea1a5f"
};

fs.writeFileSync(path.join(intermediateDir, 'fingerprint-input.json'), JSON.stringify(fingerprintInput, null, 2));
console.log('Step 2: fingerprint-input.json written with', filePaths.length, 'files.');
