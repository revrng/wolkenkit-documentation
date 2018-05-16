const fs = require('fs'),
      path = require('path'),
      util = require('util');

const glob = require('glob'),
      lunr = require('lunr');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const readdirRecursive = util.promisify(glob);

const createLunrIndex = ({ documents, ref, field }) => lunr(function () {
  this.ref(ref);
  this.field(field);
  documents.forEach(doc => this.add(doc));
});


const readMarkdownFile = async fileName => {
  const content = await readFile(fileName, 'utf8');

  return { fileName, content };
};

const readAllMarkdownFiles = async () => {
  const files = await readdirRecursive(path.join(__dirname, 'src/docs/latest', '/**/*.md'));

  return Promise.all(
    files.map(readMarkdownFile)
  );
};

(async () => {
  console.time('Create lunr index');
  const markdownFiles = await readAllMarkdownFiles();

  const documents = markdownFiles.map(md => ({
    id: md.fileName,
    content: md.content
  }));

  const searchIndex = createLunrIndex({
    documents,
    ref: 'id',
    field: 'content'
  });

  fs.writeFile(__dirname + '/generatedLunrIndex.json', JSON.stringify(searchIndex), function (err) {
    if (err) {
      console.log('An error occured while saving the lunr index');
    };

    console.log('Lunr index saved successfully!');
    console.timeEnd('Create lunr index');
  });

})();
