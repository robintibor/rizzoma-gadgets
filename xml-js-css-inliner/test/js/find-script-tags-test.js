(function() {
  var assert, jsCssInliner, testFindScriptTagsInXML;

  assert = require('assert');

  jsCssInliner = require('../../js/xml-js-css-inliner');

  testFindScriptTagsInXML = function(xmlText, expectedScriptTags) {
    var foundStringTags;
    foundStringTags = jsCssInliner.findScriptTags(xmlText);
    return assert.deepEqual(foundStringTags, expectedScriptTags);
  };

  it('Should find oneregular script tags', function() {
    return testFindScriptTagsInXML("<fake></fake><script src='testScript'></script>", ["<script src='testScript'></script>"]);
  });

  it('Should find two script tags', function() {
    return testFindScriptTagsInXML("<fake></fake><script src='testScript'></script>  <script src='testScript2'></script>", ["<script src='testScript'></script>", "<script src='testScript2'></script>"]);
  });

  it('Should find script tags ending with />', function() {
    return testFindScriptTagsInXML("<fake></fake><script src='testScript' />", ["<script src='testScript' />"]);
  });

  it('Should find script tags with spaces, ending with / >', function() {
    return testFindScriptTagsInXML("<fake></fake><script src='testScript' / >", ["<script src='testScript' / >"]);
  });

  it('Should find regular script tags with spaces between open and close tag', function() {
    return testFindScriptTagsInXML("<script src='testScript'>  </script>", ["<script src='testScript'>  </script>"]);
  });

}).call(this);
