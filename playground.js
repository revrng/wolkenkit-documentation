const lunr = require('lunr');
const searchIndexJSON = require('./generatedLunrIndex.json');

console.time('Loading the index');
const searchIndex = lunr.Index.load(searchIndexJSON);
console.timeEnd('Loading the index');

console.time('Searching for Docker');
console.log(
  searchIndex.search('+Provide +identity')
);
console.timeEnd('Searching for Docker');
