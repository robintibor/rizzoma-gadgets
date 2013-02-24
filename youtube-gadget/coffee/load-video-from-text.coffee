jQuery(document).ready(($) ->
  youtubePlayer = null
  loadYoutubeUrlOnEnter= ->
    $('#youtubeUrlText').keyup((event) ->
      enterKeyCode = 13
      if (event.keyCode == enterKeyCode)
        loadYoutubePlayerByUrlInTextBox()
    )
  
  loadYoutubeUrlOnPaste = ->
    $('#youtubeUrlText').on("paste", () ->
      setTimeout(loadYoutubePlayerByUrlInTextBox, 0) # have to use timeout here so paste is finished and then url is grabbed :)
    )
    
  loadYoutubePlayerByUrlInTextBox = ->
    enteredUrl = $('#youtubeUrlText').val()
    trimmedUrl = enteredUrl.trim()
    if (urlIsYoutubeVideo(trimmedUrl))
      removeTextField()
      youtubeVideoId = extractYoutubeVideoId(trimmedUrl)
      window.loadPlayerWithVideoId(youtubeVideoId) # see load-video-from-wave.coffee :)
      storeVideoIdInWave(youtubeVideoId)
    else
      giveWrongUrlWarning(trimmedUrl)
  
  urlIsYoutubeVideo = (url) ->
    return extractYoutubeVideoId(url) != null
  
  extractYoutubeVideoId = (url) ->
    # from http://stackoverflow.com/a/8260383/1469195
    regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
    match = url.match(regExp)
    if (match and match[7].length==11)
        return match[7]
    else
      return null

  removeTextField = ->
    $('#youtubeUrlText').remove()
  
  storeVideoIdInWave = (videoId) ->
    wave.getState().submitValue("videoId", videoId)
  
  giveWrongUrlWarning =  (url) ->
    alert("Could not use #{url}, please check if #{url} is a youtube video url :)")

  window.adjustHeightOfGadget = ->
    gadgets.window.adjustHeight()

  loadYoutubeUrlOnEnter()
  loadYoutubeUrlOnPaste()
)
