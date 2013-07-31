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
    return enterNewMode(mode);
  };

  enterNewMode = function(mode) {
    if (mode === EDIT_MODE) {
      return youtubeGadget.enterEditMode();
    } else if (mode === VIEW_MODE) {
      return youtubeGadget.enterViewMode();
    }
  };

  removeOldYoutubePlayer = function() {
    youtubeGadget.youtubePlayer.destroy();
    return $('youtubePlayerWithButtons').prepend("<div id='youtubePlayer'></div>");
  };

  youtubeGadget.enterEditMode = function() {
    if (youtubeGadget.videoLoaded()) {
      youtubeGadget.makePlayerEditable();
    } else {
      youtubeGadget.showUrlEnterBox();
    }
    return CURRENT_MODE = EDIT_MODE;
  };

  youtubeGadget.enterViewMode = function() {
    if (youtubeGadget.videoLoaded() && youtubeGadget.videoSyncedWithWave()) {
      makePlayerUneditable();
    } else if (youtubeGadget.videoLoaded() && (!youtubeGadget.videoSyncedWithWave())) {
      removeOldYoutubePlayer();
      youtubeGadget.loadVideoFromWave(makePlayerUneditable);
    } else {
      youtubeGadget.hideUrlEnterBox();
    }
    return CURRENT_MODE = VIEW_MODE;
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
