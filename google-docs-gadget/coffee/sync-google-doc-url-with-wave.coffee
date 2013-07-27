googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget

tryToLoadGoogleDocFromWave = ->
  docShouldBeLoaded = docStoredInWave()
  if (docStoredInWave())
    loadGoogleDocFromWave()
  else
    googleDocGadget.showUrlEnterBox()

docStoredInWave = ->
  return wave.getState().get("googleDocUrl")?

loadGoogleDocFromWave = ->
  googleDocUrl = getGoogleDocUrlFromWave()
  height = getHeightFromWave()
  googleDocGadget.loadGoogleDoc(googleDocUrl, height)

getGoogleDocUrlFromWave = ->
  return wave.getState().get("googleDocUrl")

getHeightFromWave = ->
  return wave.getState().get("height") || 450

googleDocGadget.storeGoogleDocUrlInWave = (googleDocUrl) ->
    wave.getState().submitValue("googleDocUrl", googleDocUrl)

googleDocGadget.saveHeightToWave = (height) ->
    wave.getState().submitValue("height", height)

wave.setStateCallback(tryToLoadGoogleDocFromWave)