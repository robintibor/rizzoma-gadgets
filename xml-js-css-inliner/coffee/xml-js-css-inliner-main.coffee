xmlJsCssInliner = require('./xml-js-css-inliner')

fileName = process.argv[2]

xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://dl.dropboxusercontent.com/u/34637013/')