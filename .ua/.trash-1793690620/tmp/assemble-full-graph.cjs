const fs = require('fs');

const assembled = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/assembled-graph.json', 'utf8'));
const layers = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/layers.json', 'utf8'));
const tour = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/tour.json', 'utf8'));
const scanResult = JSON.parse(fs.readFileSync('c:/project/portfolio/.ua/intermediate/scan-result.json', 'utf8'));

const fullGraph = {
  version: "1.0.0",
  project: {
    name: scanResult.name,
    languages: scanResult.languages,
    frameworks: scanResult.frameworks,
    description: scanResult.description,
    analyzedAt: new Date().toISOString(),
    gitCommitHash: "71113c7ffdef2b698538d51e2449227748ea1a5f"
  },
  nodes: assembled.nodes,
  edges: assembled.edges,
  layers: layers,
  tour: tour
};

fs.writeFileSync('c:/project/portfolio/.ua/intermediate/assembled-graph.json', JSON.stringify(fullGraph, null, 2));
console.log('Full KnowledgeGraph assembled successfully.');
