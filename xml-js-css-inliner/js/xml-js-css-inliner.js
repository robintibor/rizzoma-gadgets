(function() {
  var $, filterCssFilesByUrl, filterScriptsByUrl, findCssTags, findScriptTags, fs, jsdom, mapHTMLTagsToFileContents, readInlineReplacementsForCssFiles, readInlineReplacementsForScripts, replaceScriptAndCssTagsByInliningInFile,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  jsdom = require("jsdom").jsdom;

  $ = null;

  replaceScriptAndCssTagsByInliningInFile = function(fileName, urlPrefix) {
    var cssFileContent, cssFileReplacements, cssFileTag, cssMatches, cssMatchesToReplace, doc, fileContent, scriptFileContent, scriptMatches, scriptMatchesToReplace, scriptReplacements, scriptTag, window;
    fileContent = fs.readFileSync(fileName, 'utf-8');
    doc = jsdom(fileContent);
    window = doc.parentWindow;
    $ = require('jquery')(window);
    scriptMatches = findScriptTags(fileContent);
    cssMatches = findCssTags(fileContent);
    scriptMatchesToReplace = filterScriptsByUrl(scriptMatches, urlPrefix);
    cssMatchesToReplace = filterCssFilesByUrl(cssMatches, urlPrefix);
    scriptReplacements = readInlineReplacementsForScripts(scriptMatchesToReplace);
    cssFileReplacements = readInlineReplacementsForCssFiles(cssMatchesToReplace);
    for (scriptTag in scriptReplacements) {
      if (!__hasProp.call(scriptReplacements, scriptTag)) continue;
      scriptFileContent = scriptReplacements[scriptTag];
      fileContent = fileContent.replace(scriptTag, "<!--" + scriptTag + "-->\n    <script type='text/javascript'>\n    " + scriptFileContent + "\n    </script>");
    }
    for (cssFileTag in cssFileReplacements) {
      if (!__hasProp.call(cssFileReplacements, cssFileTag)) continue;
      cssFileContent = cssFileReplacements[cssFileTag];
      fileContent = fileContent.replace(cssFileTag, "<!--" + cssFileTag + "-->\n    <style type='text/css'>\n    " + cssFileContent + "\n    </style>");
    }
    return fs.writeFile(fileName.replace('.xml', '') + "-inlined.xml", fileContent, function() {
      return console.log("written file");
    });
  };

  findCssTags = function(xmlText) {
    return xmlText.match(/<link.*rel *= *['"]stylesheet['"].*\/ *>/g);
  };

  findScriptTags = function(xmlText) {
    return xmlText.match(/<script src=([^>]*)((> *<\/script>)|\/ *>)/g);
  };

  filterScriptsByUrl = function(scriptMatches, urlPrefix) {
    return scriptMatches.filter(function(scriptMatch) {
      return $(scriptMatch).is("[src^='" + urlPrefix + "']");
    });
  };

  filterCssFilesByUrl = function(cssMatches, urlPrefix) {
    return cssMatches.filter(function(cssMatch) {
      return $(cssMatch).is("[href^='" + urlPrefix + "']");
    });
  };

  readInlineReplacementsForScripts = function(scriptsToReplace) {
    var scriptsToReplacements;
    scriptsToReplacements = mapHTMLTagsToFileContents(scriptsToReplace, 'src');
    return scriptsToReplacements;
  };

  readInlineReplacementsForCssFiles = function(cssFilesToReplace) {
    var cssFileToReplacements;
    cssFileToReplacements = mapHTMLTagsToFileContents(cssFilesToReplace, 'href');
    return cssFileToReplacements;
  };

  mapHTMLTagsToFileContents = function(htmlTags, attribute) {
    var fileContent, fileUrl, filesToContents, htmlTag, relativeFileName, _i, _len;
    filesToContents = {};
    for (_i = 0, _len = htmlTags.length; _i < _len; _i++) {
      htmlTag = htmlTags[_i];
      fileUrl = $(htmlTag).attr(attribute);
      relativeFileName = fileUrl.match(/\/rizzoma-gadget[s]{0,1}\/([^?#]*)/)[1];
      fileContent = fs.readFileSync(relativeFileName, 'utf-8');
      filesToContents[htmlTag] = fileContent;
    }
    return filesToContents;
  };

  exports.filterScriptsByUrl = filterScriptsByUrl;

  exports.findScriptTags = findScriptTags;

  exports.replaceScriptAndCssTagsByInliningInFile = replaceScriptAndCssTagsByInliningInFile;

}).call(this);
