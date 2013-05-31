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
  googleDocGadget.loadGoogleDoc(googleDocUrl)

getGoogleDocUrlFromWave = ->
  return wave.getState().get("googleDocUrl")

googleDocGadget.storeGoogleDocUrlInWave = (googleDocUrl) ->
    wave.getState().submitValue("googleDocUrl", googleDocUrl)

wave.setStateCallback(tryToLoadGoogleDocFromWave)