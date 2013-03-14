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
      youtubeVideoId = extractYoutubeVideoId(trimmedUrl)
      loadYoutubePlayerFromVideoIdAndMakeEditable(youtubeVideoId)
      youtubeGadget.storeVideoIdInWave(youtubeVideoId)
    else
      giveWrongUrlWarning(trimmedUrl)
      
  urlIsYoutubeVideo = (url) ->
    return extractYoutubeVideoId(url) != null
  
  extractYoutubeVideoId = (url) ->
    # from http://stackoverflow.com/a/8260383/1469195
    regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??(feature=\w+&)?v?=?([^#\&\?]*).*/
    match = url.match(regExp)
    if (match and match[8].length==11)
        return match[8]
    else
      return null

  removeTextField = ->
    $('#youtubeUrlText').remove()
  
  loadYoutubePlayerFromVideoIdAndMakeEditable = (youtubeVideoId) ->
    videoStart = videoEnd = null # do not know start and end times :)
    makeNewPlayerEditable = () ->
      youtubeGadget.enterEditMode()
    youtubeGadget.loadPlayerWithVideoId(youtubeVideoId, 640, 390, videoStart, videoEnd, makeNewPlayerEditable)

  giveWrongUrlWarning =  (url) ->
    alert("Could not use #{url}, please check if #{url} is a youtube video url :)")

  # function also used by sync-video-with-wave.coffee
  youtubeGadget.loadPlayerWithVideoId = (videoId, videoWidth = 640, videoHeight = 390,
    videoStart, videoEnd, onReady) ->
    removeTextField()
    playerVariables = createPlayerVariables(videoStart, videoEnd)
    youtubePlayer = new YT.Player('youtubePlayer', {
          width: videoWidth,
          height: videoHeight,
          videoId: videoId,
          playerVars : playerVariables,
          events: {
            'onReady': () ->
              #remember youtube player! :)
              youtubeGadget.youtubePlayer = youtubePlayer
              onReady()
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
