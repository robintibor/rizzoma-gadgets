youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget

VIEW_MODE = 1
EDIT_MODE = 2
CURRENT_MODE = 1

reactToBlipModeChange = ->
  wave.setModeCallback(youtubeGadget.enterCurrentMode)
  
youtubeGadget.enterCurrentMode = ->
  mode = wave.getMode()
  enterNewMode(mode)

enterNewMode = (mode) ->
  if (mode == EDIT_MODE)
    youtubeGadget.enterEditMode()
  else if (mode == VIEW_MODE)
    youtubeGadget.enterViewMode()

removeOldYoutubePlayer = ->
  youtubeGadget.youtubePlayer.destroy()
  $('youtubePlayerWithButtons').prepend("<div id='youtubePlayer'></div>")

youtubeGadget.enterEditMode = ->
  if (youtubeGadget.videoLoaded())
    youtubeGadget.makePlayerEditable()
  else
    youtubeGadget.showUrlEnterBox()
  CURRENT_MODE = EDIT_MODE

youtubeGadget.enterViewMode = ->
  if (youtubeGadget.videoLoaded() and youtubeGadget.videoSyncedWithWave())
    makePlayerUneditable()
  else if (youtubeGadget.videoLoaded() and (not youtubeGadget.videoSyncedWithWave()))
    removeOldYoutubePlayer()
    youtubeGadget.loadVideoFromWave(makePlayerUneditable)
  else
    youtubeGadget.hideUrlEnterBox()
  CURRENT_MODE = VIEW_MODE

youtubeGadget.makePlayerEditable = ->
    videoStart = youtubeGadget.getVideoStartFromWave()
    videoEnd = youtubeGadget.getVideoEndFromWave()
    youtubeGadget.makeVideoResizable()
    youtubeGadget.makeStartEndTimeSettable(videoStart, videoEnd)
    youtubeGadget.adjustHeightOfGadget()


makePlayerUneditable = ->
  youtubeGadget.makeVideoUnresizable()
  youtubeGadget.hideStartEndButtons()
  youtubeGadget.adjustHeightOfGadget()

reactToBlipModeChange()