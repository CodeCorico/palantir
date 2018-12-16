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

files.forEach((file) => {
  const markdown = fs.readFileSync(file, 'utf8');
  const html = marked(markdown);

  const newFile = file.replace(srcRoot, '').replace(/.md$/i, '.html');
  const newFilePath = `${dest}/${newFile}`;
  const newDir = path.dirname(newFilePath);

  mkp.sync(newDir);

  fs.writeFileSync(newFilePath, html);
});

