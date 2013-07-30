(function() {
  var CURRENT_MODE, EDIT_MODE, VIEW_MODE, enterNewMode, makePlayerUneditable, reactToBlipModeChange, removeOldYoutubePlayer, youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  VIEW_MODE = 1;

  EDIT_MODE = 2;

  CURRENT_MODE = 1;

  reactToBlipModeChange = function() {
    return wave.setModeCallback(youtubeGadget.enterCurrentMode);
  };

  youtubeGadget.enterCurrentMode = function() {
    var mode;
    mode = wave.getMode();
    if (mode !== CURRENT_MODE) {
      enterNewMode(mode);
      return CURRENT_MODE = mode;
    }
  };

  enterNewMode = function(mode) {
    if (mode === EDIT_MODE) {
      return youtubeGadget.enterEditMode();
    } else if (mode === VIEW_MODE) {
      removeOldYoutubePlayer();
      return youtubeGadget.loadVideoFromWave(youtubeGadget.enterViewMode);
    }
  };

  removeOldYoutubePlayer = function() {
    youtubeGadget.youtubePlayer.destroy();
    return $('youtubePlayerWithButtons').prepend("<div id='youtubePlayer'></div>");
  };

  youtubeGadget.enterEditMode = function() {
    return youtubeGadget.makePlayerEditable();
  };

  youtubeGadget.enterViewMode = function() {
    return makePlayerUneditable();
  };

  youtubeGadget.makePlayerEditable = function() {
    var videoEnd, videoStart;
    videoStart = youtubeGadget.getVideoStartFromWave();
    videoEnd = youtubeGadget.getVideoEndFromWave();
    youtubeGadget.makeVideoResizable();
    youtubeGadget.makeStartEndTimeSettable(videoStart, videoEnd);
    return youtubeGadget.adjustHeightOfGadget();
  };

  makePlayerUneditable = function() {
    youtubeGadget.makeVideoUnresizable();
    youtubeGadget.hideStartEndButtons();
    return youtubeGadget.adjustHeightOfGadget();
  };

  reactToBlipModeChange();

}).call(this);
