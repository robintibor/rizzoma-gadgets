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
  # iframe should only be shown after focus because google doc javascript
  # sets focus on some element inside doc and then whole rizzoma topic
  # scrolls up to the google doc :(
  # if iframe is hidden when focus is set, scrolling is not affected by focus
  # somehow this only works with chrome (firefox document.activeElement is not
  # set to iframe when its hidden)
  if (weAreUsingChrome())
    showIFrameAfterFocus()
    # as a precaution also show iframe 5 sec after load seconds in all cases
    showIFrameAfterLoad(5000)
  else
    showIFrameAfterLoad(100)
  # as a precaution always show iframe after 14 sec
  setTimeout(showIFrame, 14000)
  setIFrameSource(googleDocLink)

removeTextField = ->
  $('#googleDocUrlText').remove()

weAreUsingChrome = ->
  # for now both variants because browser detect script was not loaded immediately
  # from gadget xml because of cache
  if (BrowserDetect?)
    return BrowserDetect.browser == "Chrome"
  else
    return window.chrome?

setIFrameSource = (googleDocLink) ->
  $("#googleDocIFrame").attr("src", googleDocLink)

showIFrameAfterFocus = ->
  # focus event does not fire from iframes, therefore i poll document.activeElement
  # http://stackoverflow.com/questions/5456239/detecting-when-an-iframe-gets-or-loses-focus
  if document.activeElement == $('#googleDocIFrame')[0]
    showIFrame()
  else
    setTimeout(showIFrameAfterFocus, 100)

showIFrameAfterLoad = (timeOut) ->
  # use timeout to increase chance of doc already being focussed before show...
  $('#googleDocIFrame').load(() ->
    setTimeout(showIFrame, timeOut))

# can be called repeatedly without problems
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
