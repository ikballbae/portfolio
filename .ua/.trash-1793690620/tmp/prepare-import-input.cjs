const fs = require('fs');
const scanData = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/tmp/ua-scan-files.json', 'utf8'));
const input = {
  projectRoot: 'c:/project/portfolio',
  files: scanData.files.map(f => ({ path: f.path, language: f.language, fileCategory: f.fileCategory }))
};
fs.writeFileSync('c:/project/portfolio/.ua/tmp/ua-import-map-input.json', JSON.stringify(input, null, 2));
