assert = require('assert')
jsCssInliner = require('../../js/xml-js-css-inliner')

testFindScriptTagsInXML = (xmlText, expectedScriptTags) ->
  foundStringTags = jsCssInliner.findScriptTags(xmlText)
  assert.deepEqual(foundStringTags, expectedScriptTags)

it('Should find oneregular script tags', () ->
  testFindScriptTagsInXML("<fake></fake><script src='testScript'></script>",
    ["<script src='testScript'></script>"])
)

it('Should find two script tags', () ->
  testFindScriptTagsInXML( "<fake></fake><script src='testScript'></script>
  <script src='testScript2'></script>",
    ["<script src='testScript'></script>", "<script src='testScript2'></script>"])
)

it('Should find script tags ending with />', () ->
  testFindScriptTagsInXML( "<fake></fake><script src='testScript' />",
    ["<script src='testScript' />"])
)

it('Should find script tags with spaces, ending with / >', () ->
  testFindScriptTagsInXML("<fake></fake><script src='testScript' / >",
    ["<script src='testScript' / >",])
)

it('Should find regular script tags with spaces between open and close tag', () ->
  testFindScriptTagsInXML("<script src='testScript'>  </script>",
    ["<script src='testScript'>  </script>"])
)