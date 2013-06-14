googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget

# from http://stackoverflow.com/a/11654596/1469195, then changed to coffeescript
googleDocGadget.updateQueryString = (key, value, url) ->
  url = window.location.href  unless url
  re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi")
  if (re.test(url))
    if (typeof value isnt "undefined" and value isnt null)
      url = url.replace(re, '$1' + key + "=" + value + '$2$3')
    else
      url = url.replace(re, "$1$3").replace(/(&|\?)$/, "")
  else
    if (typeof value isnt "undefined" and value isnt null)
      separator = (if url.indexOf("?") isnt -1 then "&" else "?")
      hash = url.split("#")
      url = hash[0] + separator + key + "=" + value
      url += "#" + hash[1]  if hash[1]
      url
  return url

loadGoogleDocOnEnter= ->
  $('#googleDocUrlText').keyup((event) ->
    enterKeyCode = 13
    if (event.keyCode == enterKeyCode)
      loadGoogleDoc()
  )

loadGoogleDocOnPaste = ->
  $('#googleDocUrlText').on("paste", () ->
    setTimeout(loadGoogleDocFromTextBox, 0) # have to use timeout here so paste is finished and then url is grabbed :)
  )

loadGoogleDocFromTextBox = ->
  enteredUrl = $('#googleDocUrlText').val()
  googleDocLink = enteredUrl.trim()
  googleDocLinkForMinimalUI = googleDocGadget.updateQueryString("rm", "minimal", googleDocLink)
  googleDocGadget.loadGoogleDoc(googleDocLinkForMinimalUI)
  googleDocGadget.storeGoogleDocUrlInWave(googleDocLinkForMinimalUI)
  
googleDocGadget.loadGoogleDoc = (googleDocLink) ->
  removeTextField()
  showIFrameOnLoad()
  setIFrameSource(googleDocLink)

removeTextField = ->
  $('#googleDocUrlText').remove()

setIFrameSource = (googleDocLink) ->
  $("#googleDocIFrame").attr("src", googleDocLink)

showIFrameOnLoad = ->
  $("#googleDocIFrame").load(showIFrame)

showIFrame = ->
   $('#googleDocIFrame').show()
   adjustHeightOfGadget()

adjustHeightOfGadget = ->
  gadgets.window.adjustHeight()

# for loading at start if no url is present in wave (see sync with wave file)
googleDocGadget.showUrlEnterBox = ->
  jQuery('#googleDocUrlText').show()

loadGoogleDocOnEnter()
loadGoogleDocOnPaste()
