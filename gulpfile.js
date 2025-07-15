const { series, src, dest } = require('gulp');
const copy = require('gulp-copy');

function buildIcons() {
  return src('nodes/*/**.svg')
    .pipe(copy('./dist/nodes', { prefix: 1 }));
}

exports['build:icons'] = buildIcons;
