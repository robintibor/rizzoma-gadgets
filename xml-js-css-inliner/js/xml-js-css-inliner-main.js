(function() {
  var fileName, xmlJsCssInliner;

  xmlJsCssInliner = require('./xml-js-css-inliner');

  fileName = process.argv[2];

  xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://preview.c9users.io/robintibor/rizzoma-gadget/workspace/');

}).call(this);
