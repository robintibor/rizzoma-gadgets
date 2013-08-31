assert = require('assert')
jsCssInliner = require('../../js/xml-js-css-inliner')


it('Should leave correct script src', () ->
  scriptTags = jsCssInliner.filterScriptsByUrl(["<script src='c9.io/testScript'></script>"], 'c9.io')
  expectedScriptTags = ["<script src='c9.io/testScript'></script>"]
  assert.deepEqual(expectedScriptTags, scriptTags)
)

it('Should remove wrong correct script src', () ->
  scriptTags = jsCssInliner.filterScriptsByUrl(["<script src='google.com/testScript'></script>"], 'c9.io')
  expectedScriptTags = []
  assert.deepEqual(expectedScriptTags, scriptTags)
)

it('Should leave correct script src with double quote', () ->
  scriptTags = jsCssInliner.filterScriptsByUrl(['<script src="c9.io/testScript"></script>'], 'c9.io')
  expectedScriptTags = ['<script src="c9.io/testScript"></script>']
  assert.deepEqual(expectedScriptTags, scriptTags)
)

it('Should leave correct script src with spaces', () ->
  scriptTags = jsCssInliner.filterScriptsByUrl(["<script src  =  'c9.io/testScript'></script>"], 'c9.io')
  expectedScriptTags = ["<script src  =  'c9.io/testScript'></script>"]
  assert.deepEqual(expectedScriptTags, scriptTags)
)