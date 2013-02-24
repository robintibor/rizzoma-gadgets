(function() {
  var saveNewPlayerSizeToWave;

  window.makeVideoResizable = function() {
    console.log("resizable!");
    return $('#youtubePlayerWrap').resizable({
      aspectRatio: true,
      alsoResize: "#youtubePlayer",
      resize: function(event, ui) {
        return window.adjustHeightOfGadget();
      },
      stop: function(event, ui) {
        return saveNewPlayerSizeToWave(ui.size);
      }
    });
  };

  saveNewPlayerSizeToWave = function(size) {
    wave.getState().submitValue("videoWidth", size.width);
    return wave.getState().submitValue("videoHeight", size.height);
  };

}).call(this);
