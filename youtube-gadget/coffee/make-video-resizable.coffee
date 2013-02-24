window.makeVideoResizable = ->
  console.log("resizable!")
  $('#youtubePlayerWrap').resizable(
    {
      aspectRatio: true,
      alsoResize: "#youtubePlayer",
      resize: (event, ui) ->
        window.adjustHeightOfGadget()
      stop: (event, ui) ->
        saveNewPlayerSizeToWave(ui.size)
    }
  )

saveNewPlayerSizeToWave = (size) ->
  wave.getState().submitValue("videoWidth", size.width)
  wave.getState().submitValue("videoHeight", size.height)