(function() {
  var fileName, xmlJsCssInliner;

  xmlJsCssInliner = require('./xml-js-css-inliner');

  fileName = process.argv[2];

  xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://dl.dropboxusercontent.com/u/34637013/');

  xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://preview.c9.io/robintibor/rizzoma-gadget/multi-criteria-decision-gadget/js/');

}).call(this);
