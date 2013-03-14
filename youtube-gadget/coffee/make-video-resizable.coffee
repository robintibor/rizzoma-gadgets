youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget

youtubeGadget.makeVideoResizable = ->
  $('#youtubePlayerWithButtons').addClass('youtubePlayerResizable')
  $('#youtubePlayerWithButtons').resizable(
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
  

youtubeGadget.makeVideoUnresizable = ->
  $('#youtubePlayerWithButtons').removeClass('youtubePlayerResizable')
  $('#youtubePlayerWithButtons').resizable('destroy')
