(function() {
  var docStoredInWave, getGoogleDocUrlFromWave, googleDocGadget, loadGoogleDocFromWave, tryToLoadGoogleDocFromWave;

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
    var googleDocUrl;
    googleDocUrl = getGoogleDocUrlFromWave();
    return googleDocGadget.loadGoogleDoc(googleDocUrl);
  };

  getGoogleDocUrlFromWave = function() {
    return wave.getState().get("googleDocUrl");
  };

  googleDocGadget.storeGoogleDocUrlInWave = function(googleDocUrl) {
    return wave.getState().submitValue("googleDocUrl", googleDocUrl);
  };

  wave.setStateCallback(tryToLoadGoogleDocFromWave);

}).call(this);
