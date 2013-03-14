(function() {
  var youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  youtubeGadget.makeVideoResizable = function() {
    $('#youtubePlayerWithButtons').addClass('youtubePlayerResizable');
    return $('#youtubePlayerWithButtons').resizable({
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

  youtubeGadget.makeVideoUnresizable = function() {
    $('#youtubePlayerWithButtons').removeClass('youtubePlayerResizable');
    return $('#youtubePlayerWithButtons').resizable('destroy');
  };

}).call(this);
