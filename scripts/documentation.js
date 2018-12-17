const path = require('path');
const fs = require('fs');
const glob = require('glob');
const marked = require('marked');
const mkp = require('mkp');

let src = '';
let dest = '';
let srcRoot = '';

process.argv.forEach((arg) => {
  if (src === true) {
    src = arg;
  } else if (srcRoot === true) {
    srcRoot = arg;
  } else if (dest === true) {
    dest = arg.replace(/\/$/, '');
  } else if (arg === '-s') {
    src = true;
  } else if (arg === '-sr') {
    srcRoot = true;
  } else if (arg === '-d') {
    dest = true;
  }
});

const files = glob.sync(src);
const jsonTree = [];

const fillTree = (tree, fileSplitted, index = 0) => {
  let actualTree = -1;
  const file = fileSplitted[index];

  for (let i = 0; i < tree.length; i++) {
    if (tree[i].path === file) {
      actualTree = i;
    }
  }

  if (actualTree < 0) {
    const isFile = fileSplitted.length === index + 1;

    tree.push(isFile ? { file, link: fileSplitted.join('/') } : { path: file, tree: [] });
    actualTree = tree.length - 1;

    if (isFile) {
      return;
    }
  }

  fillTree(tree[actualTree].tree, fileSplitted, index + 1);
};

files.forEach((file) => {
  const markdown = fs.readFileSync(file, 'utf8');
  const html = marked(markdown);

  const newFile = file.replace(srcRoot, '').replace(/.md$/i, '.html');
  const newFilePath = `${dest}/${newFile}`;
  const newDir = path.dirname(newFilePath);

  fillTree(jsonTree, newFile.split('/'));

  mkp.sync(newDir);

  fs.writeFileSync(newFilePath, html);
});

fs.writeFileSync(`${dest}/glossary.json`, JSON.stringify(jsonTree));
