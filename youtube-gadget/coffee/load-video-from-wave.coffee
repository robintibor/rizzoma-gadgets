
# called from gadget.xml itself :)
window.loadVideoFromWave = ->
  if (videoIdStoredInWave() and youtubeApiReady())
    loadVideoFromWave()
  else if (videoIdStoredInWave() and not youtubeApiReady())
    setTimeout(window.loadVideoFromWave, 1000)
  else
    showUrlEnterBox()

videoIdStoredInWave = ->
  return wave.getState().get("videoId")?

youtubeApiReady = ->
  return YT.Player?

loadVideoFromWave = ->
  videoId = getVideoIdFromWave()
  videoWidth = getVideoWidthFromWave()
  videoHeight = getVideoHeightFromWave()
  console.log(videoWidth)
  console.log(videoHeight)
  window.loadPlayerWithVideoId(videoId, videoWidth, videoHeight)
  
getVideoIdFromWave = ->
  return wave.getState().get("videoId")
  
getVideoWidthFromWave = ->
  return wave.getState().get("videoWidth") || 640

getVideoHeightFromWave = ->
  return wave.getState().get("videoHeight") || 390
  
window.loadPlayerWithVideoId = (videoId, videoWidth = 640, videoHeight = 390) ->
  console.log(videoWidth)
  console.log(videoHeight)
  youtubePlayer = new YT.Player('youtubePlayer', {
        width: videoWidth,
        height: videoHeight,
        videoId: videoId,
        events: {
          'onReady': () ->
            window.adjustHeightOfGadget()
            window.makeVideoResizable()
            window.youtubePlayer = youtubePlayer
        }
      }
    )

showUrlEnterBox = ->
  jQuery('#youtubeUrlText').show()

wave.setStateCallback(window.loadVideoFromWave)