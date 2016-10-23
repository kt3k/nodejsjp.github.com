const bulbo = require('bulbo')
const asset = bulbo.asset

const path = require('path')
const frontMatter = require('gulp-front-matter')
const nunjucks = require('gulp-nunjucks')
const marked = require('gulp-marked')
const wrapper = require('layout-wrapper')
const accumulate = require('vinyl-accumulate')

const data = {
  orgName: 'Node.js 日本ユーザーグループ',
  pages: require('./pages'),
  layoutDir: path.join(__dirname, 'source/layout')
}

// const nunjucksDate = require('nunjucks-date')
require('nunjucks').configure().addFilter('date', require('nunjucks-date'))

bulbo.dest('build') // Sets the destination
bulbo.port(3100) // Sets the dev server's port

const layout = defaultLayout => wrapper.nunjucks({
  data,
  defaultLayout,
  layout: 'source/layout',
  extname: '.njk'
})

asset('source/**/*.md', '!source/events/**/*')
  .watch('source/**/*.{md,njk}')
  .pipe(frontMatter({property: 'fm'}))
  .pipe(nunjucks.compile(data))
  .pipe(marked())
  .pipe(layout('default'))

asset('source/events/**/*.md')
  .watch('source/**/*.{md,njk}')
  .base('source')
  .pipe(frontMatter({property: 'fm'}))
  .pipe(marked())
  .pipe(accumulate('events.html', {debounce: true}))
  .pipe(layout('event-index'))

asset('source/events/**/*.md')
  .watch('source/**/*.{md,njk}')
  .base('source')
  .pipe(frontMatter({property: 'fm'}))
  .pipe(marked())
  .pipe(layout('event'))

asset('source/css/*.css')
  .base('source')

asset('source/images/**/*')
  .base('source')
