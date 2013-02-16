onWaveStateChange = ->
  # image size first, so that image is not first loaded with wrong size
  window.loadImageSizeFromWave()
  window.loadImageFromWave(window.loadAnnotationsFromWave)

wave.setStateCallback(onWaveStateChange)