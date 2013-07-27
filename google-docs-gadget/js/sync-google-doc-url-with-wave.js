(function() {
  var docStoredInWave, getGoogleDocUrlFromWave, getHeightFromWave, googleDocGadget, loadGoogleDocFromWave, tryToLoadGoogleDocFromWave;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  tryToLoadGoogleDocFromWave = function() {
    var docShouldBeLoaded;
    docShouldBeLoaded = docStoredInWave();
    if (docStoredInWave()) {
      return loadGoogleDocFromWave();
    } else {
      return googleDocGadget.showUrlEnterBox();
    }
  };

  docStoredInWave = function() {
    return wave.getState().get("googleDocUrl") != null;
  };

  loadGoogleDocFromWave = function() {
    var googleDocUrl, height;
    googleDocUrl = getGoogleDocUrlFromWave();
    height = getHeightFromWave();
    return googleDocGadget.loadGoogleDoc(googleDocUrl, height);
  };

  getGoogleDocUrlFromWave = function() {
    return wave.getState().get("googleDocUrl");
  };

  getHeightFromWave = function() {
    return wave.getState().get("height") || 450;
  };

  googleDocGadget.storeGoogleDocUrlInWave = function(googleDocUrl) {
    return wave.getState().submitValue("googleDocUrl", googleDocUrl);
  };

  googleDocGadget.saveHeightToWave = function(height) {
    return wave.getState().submitValue("height", height);
  };

  wave.setStateCallback(tryToLoadGoogleDocFromWave);

}).call(this);
