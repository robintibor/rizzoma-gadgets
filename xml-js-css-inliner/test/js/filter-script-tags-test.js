(function() {
  var assert, jsCssInliner;

  assert = require('assert');

  jsCssInliner = require('../../js/xml-js-css-inliner');

  it('Should leave correct script src', function() {
    var expectedScriptTags, scriptTags;
    scriptTags = jsCssInliner.filterScriptsByUrl(["<script src='c9.io/testScript'></script>"], 'c9.io');
    expectedScriptTags = ["<script src='c9.io/testScript'></script>"];
    return assert.deepEqual(expectedScriptTags, scriptTags);
  });

  it('Should remove wrong correct script src', function() {
    var expectedScriptTags, scriptTags;
    scriptTags = jsCssInliner.filterScriptsByUrl(["<script src='google.com/testScript'></script>"], 'c9.io');
    expectedScriptTags = [];
    return assert.deepEqual(expectedScriptTags, scriptTags);
  });

  it('Should leave correct script src with double quote', function() {
    var expectedScriptTags, scriptTags;
    scriptTags = jsCssInliner.filterScriptsByUrl(['<script src="c9.io/testScript"></script>'], 'c9.io');
    expectedScriptTags = ['<script src="c9.io/testScript"></script>'];
    return assert.deepEqual(expectedScriptTags, scriptTags);
  });

  it('Should leave correct script src with spaces', function() {
    var expectedScriptTags, scriptTags;
    scriptTags = jsCssInliner.filterScriptsByUrl(["<script src  =  'c9.io/testScript'></script>"], 'c9.io');
    expectedScriptTags = ["<script src  =  'c9.io/testScript'></script>"];
    return assert.deepEqual(expectedScriptTags, scriptTags);
  });

}).call(this);
