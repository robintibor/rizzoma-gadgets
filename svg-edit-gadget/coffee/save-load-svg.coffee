console.log("loading svg from wave file!!! version2")
lastWaveSVGString = null
lastCanvasSVGString = null
loadSvgFromWave = ->
  waveSVGString = getWaveSVGString()
  canvasSVGString = getCurrentCanvasSVGString()
  if (waveAndCanvasDifferent() and lastWaveSVGString != waveSVGString)
    console.log("strings different for loading svg from wave")
    setCanvasSVGString(waveSVGString)
    lastWaveSVGString = waveSVGString

getWaveSVGString = ->
  return wave.getState().get("svgString")

getCurrentCanvasSVGString = ->
  return svgCanvas.getSvgString()

justSetCanvasString = false

setCanvasSVGString = (svgString) ->
  console.log("setting canvas svg string")
  svgCanvas.setSvgString(svgString)
  justSetCanvasString = true

saveSVGToWaveOnChange = ->
  console.log("adding extension rizzoma save!!")
  svgEditor.addExtension("Rizzoma-Save", () ->
        return {
                elementChanged: saveSVGStringToWaveIfChanged
        }
  )

saveSVGStringToWaveIfChanged = ->
  if (justSetCanvasString)
    console.log("ignoring change because it came from string!:)")
    justSetCanvasString = false
    return
  console.log("checking if svg string should be saved to wave!")
  waveSVGString = getWaveSVGString()
  # IS it still true?:
  # cannot use getCurrentCanvasSVGString because svgCanvas is only
  # given by paramter ot unfciton, no longer simply available...
  canvasSVGString = svgCanvas.getSvgString()
  if (waveAndCanvasDifferent() and lastCanvasSVGString != canvasSVGString)
    console.log("strings different for saving to wave")
    saveSVGStringToWave(canvasSVGString)
    lastCanvasSVGString = canvasSVGString

saveSVGStringToWave = (svgString) ->
    console.log("saving svg string to wave! :) :")
    wave.getState().submitValue("svgString", svgString)

waveAndCanvasDifferent = ->
  wave.getState().get("svgString") != svgCanvas.getSvgString()

wave.setStateCallback(loadSvgFromWave)

saveSVGToWaveOnChange()


