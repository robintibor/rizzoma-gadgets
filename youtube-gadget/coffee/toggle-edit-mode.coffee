youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget

onClickOfEditButtonEnterEditMode = ->
  $('#editVideoButton').click(youtubeGadget.enterEditMode)

onClickOfDoneButtonEnterViewMode = ->
  $('#finishedEditingVideoButton').click(() ->
    removeOldYoutubePlayer()
    youtubeGadget.loadVideoFromWave()
    youtubeGadget.enterViewMode()
  )

removeOldYoutubePlayer = ->
  youtubeGadget.youtubePlayer.destroy()
  $('youtubePlayerWithButtons').prepend("<div id='youtubePlayer'></div>")

youtubeGadget.enterEditMode = ->
  $('#editVideoButton').hide()
  $('#finishedEditingVideoButton').show()
  youtubeGadget.makePlayerEditable()

youtubeGadget.enterViewMode = ->
  $('#finishedEditingVideoButton').hide()
  $('#editVideoButton').show()
  makePlayerUneditable()

youtubeGadget.makePlayerEditable = ->
    videoStart = youtubeGadget.getVideoStartFromWave()
    videoEnd = youtubeGadget.getVideoEndFromWave()
    youtubeGadget.makeVideoResizable()
    youtubeGadget.showStartAndEndButtons(videoStart, videoEnd)
    youtubeGadget.adjustHeightOfGadget()

makePlayerUneditable = ->
  youtubeGadget.makeVideoUnresizable()
  youtubeGadget.hideStartEndButtons()
  youtubeGadget.adjustHeightOfGadget()

onClickOfEditButtonEnterEditMode()
onClickOfDoneButtonEnterViewMode()