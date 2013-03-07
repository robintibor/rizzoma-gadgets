jQuery(document).ready(($) ->
  youtubeGadget = window.youtubeGadget || {}
  window.youtubeGadget = youtubeGadget
  
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
      youtubeGadget.loadPlayerWithVideoId(youtubeVideoId) # see load-video-from-wave.coffee :)
      youtubeGadget.storeVideoIdInWave(youtubeVideoId)
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
  
  giveWrongUrlWarning =  (url) ->
    alert("Could not use #{url}, please check if #{url} is a youtube video url :)")

  # function also used by sync-video-with-wave.coffee
  youtubeGadget.loadPlayerWithVideoId = (videoId, videoWidth = 640, videoHeight = 390,
    videoStart, videoEnd) ->
    playerVariables = createPlayerVariables(videoStart, videoEnd)
    youtubePlayer = new YT.Player('youtubePlayer', {
          width: videoWidth,
          height: videoHeight,
          videoId: videoId,
          playerVars : playerVariables,
          events: {
            'onReady': () ->
              youtubeGadget.youtubePlayer = youtubePlayer
              youtubeGadget.adjustHeightOfGadget()
              youtubeGadget.makeVideoResizable()
              youtubeGadget.showStartAndEndButtons(videoStart, videoEnd)
          }
        }
      )

  createPlayerVariables = (videoStart, videoEnd) ->
    playerVariables = {}
    if videoStart?
      playerVariables.start = videoStart
    if videoEnd?
      playerVariables.end = videoEnd
    return playerVariables

  youtubeGadget.videoLoaded = ->
    return youtubePlayer?

  youtubeGadget.showUrlEnterBox = ->
    jQuery('#youtubeUrlText').show()

  youtubeGadget.adjustHeightOfGadget = ->
    gadgets.window.adjustHeight()

  loadYoutubeUrlOnEnter()
  loadYoutubeUrlOnPaste()
)
