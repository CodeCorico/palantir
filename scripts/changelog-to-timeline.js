const fs = require('fs');
const marked = require('marked');

let src = '';
let dest = '';

process.argv.forEach((arg) => {
  if (src === true) {
    src = arg;
  } else if (dest === true) {
    dest = arg;
  } else if (arg === '-s') {
    src = true;
  } else if (arg === '-d') {
    dest = true;
  }
});

const TYPES = {
  'breaking changes': 'idle',
  'features': 'success',
  'bug fixes': 'warning',
};

const unescapeHtml = (text) => {
  var map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': '\'',
  };

  return text.replace(/&[#0-9a-z]+;/gi, m => map[m]);
}

const markdown = fs.readFileSync(src, 'utf8');
const html = marked(markdown)
  .replace(/<a /g, () => '<a target="_blank" ');
const contents = html
  .split('<h2')
  .filter(content => !!content)
  .map(content => `<h2${content}`.replace(/\n/g, ' '));

const dates = [];

contents.forEach((content) => {
  const date = {
    content,
    events: {},
  };

  let match = content.match(/<h2.*?>(.*?)<\/h2>/);
  if (!match || match.length < 2) {
    return;
  }

  match = match[1]
    .replace(/<\/?a.*?>/g, '')
    .split(' ');

  if (!match || match.length < 1) {
    return;
  }

  date.title = match[0];

  if (match.length > 1) {
    date.subtitle = match[1].replace(/[\(\)]/g, '');
  }

  match = content.match(/<h3.*?>.*?<\/ul>/g);
  if (match) {
    match.forEach((typeBlock) => {
      let matchTypeBlock = typeBlock.match(/<h3.*?>(.*?)<\/h3>/);
      if (!matchTypeBlock || matchTypeBlock.length < 2) {
        return;
      }

      const type = TYPES[matchTypeBlock[1].toLowerCase()];
      if (!type) {
        return;
      }

      matchTypeBlock = typeBlock.match(/<li.*?>.*?<\/li>/g);

      matchTypeBlock.forEach((eventBlock) => {
        let matchEventBlock = eventBlock.match(/<strong>(.*?):<\/strong>/);
        let matchEventBlockText = eventBlock.match(/<\/strong>(.*?)\(<a/);

        if (
          !matchEventBlock || matchEventBlock.length < 2
          || !matchEventBlockText || matchEventBlockText.length < 2
        ) {
          return;
        }

        const eventName = matchEventBlock[1];
        date.events[eventName] = date.events[eventName] || {};
        date.events[eventName][type] = date.events[eventName][type] || [];
        date.events[eventName][type].push(unescapeHtml(matchEventBlockText[1]).trim());
      });
    });
  }

  dates.push(date);
});

fs.writeFileSync(dest, JSON.stringify({ dates }, 2));
