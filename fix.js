const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src/app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('text-sm font-medium text-slate-700')) {
    content = content.split('className="text-sm font-medium text-slate-700"').join('className="block mb-2 text-sm font-medium text-slate-700"');
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
