youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget

youtubeGadget.makeVideoResizable = ->
  $('#youtubePlayerResizableWrap').resizable(
    {
      aspectRatio: true,
      alsoResize: "#youtubePlayer",
      minWidth: 350,
      resize: (event, ui) ->
        youtubeGadget.adjustHeightOfGadget()
      stop: (event, ui) ->
        youtubeGadget.saveNewPlayerSizeToWave(ui.size)
    }
  )
