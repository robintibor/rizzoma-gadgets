(function() {
  var youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  youtubeGadget.makeVideoResizable = function() {
    return $('#youtubePlayerResizableWrap').resizable({
      aspectRatio: true,
      alsoResize: "#youtubePlayer",
      minWidth: 350,
      resize: function(event, ui) {
        return youtubeGadget.adjustHeightOfGadget();
      },
      stop: function(event, ui) {
        return youtubeGadget.saveNewPlayerSizeToWave(ui.size);
      }
    });
  };

}).call(this);
