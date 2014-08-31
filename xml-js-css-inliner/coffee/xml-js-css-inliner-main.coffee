# WARNING: ATM this will fail..
xmlJsCssInliner = require('./xml-js-css-inliner')

fileName = process.argv[2]

# TODO: try removing btoh dropbox and c9 links... file will be saved with suffix -inlined.xml 
# instead of just .xml, so use this filename in second run
xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://dl.dropboxusercontent.com/u/34637013/')
xmlJsCssInliner.replaceScriptAndCssTagsByInliningInFile(fileName, 'https://preview.c9.io/robintibor/rizzoma-gadget/multi-criteria-decision-gadget/js/')
