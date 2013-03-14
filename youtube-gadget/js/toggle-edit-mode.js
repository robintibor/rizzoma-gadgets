(function() {
  var makePlayerUneditable, onClickOfDoneButtonEnterViewMode, onClickOfEditButtonEnterEditMode, removeOldYoutubePlayer, youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  onClickOfEditButtonEnterEditMode = function() {
    return $('#editVideoButton').click(youtubeGadget.enterEditMode);
  };

  onClickOfDoneButtonEnterViewMode = function() {
    return $('#finishedEditingVideoButton').click(function() {
      removeOldYoutubePlayer();
      youtubeGadget.loadVideoFromWave();
      return youtubeGadget.enterViewMode();
    });
  };

  removeOldYoutubePlayer = function() {
    youtubeGadget.youtubePlayer.destroy();
    return $('youtubePlayerWithButtons').prepend("<div id='youtubePlayer'></div>");
  };

  youtubeGadget.enterEditMode = function() {
    $('#editVideoButton').hide();
    $('#finishedEditingVideoButton').show();
    return youtubeGadget.makePlayerEditable();
  };

  youtubeGadget.enterViewMode = function() {
    $('#finishedEditingVideoButton').hide();
    $('#editVideoButton').show();
    return makePlayerUneditable();
  };

  youtubeGadget.makePlayerEditable = function() {
    var videoEnd, videoStart;
    videoStart = youtubeGadget.getVideoStartFromWave();
    videoEnd = youtubeGadget.getVideoEndFromWave();
    youtubeGadget.makeVideoResizable();
    youtubeGadget.showStartAndEndButtons(videoStart, videoEnd);
    return youtubeGadget.adjustHeightOfGadget();
  };

  makePlayerUneditable = function() {
    youtubeGadget.makeVideoUnresizable();
    youtubeGadget.hideStartEndButtons();
    return youtubeGadget.adjustHeightOfGadget();
  };

  onClickOfEditButtonEnterEditMode();

  onClickOfDoneButtonEnterViewMode();

}).call(this);
