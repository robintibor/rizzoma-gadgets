(function() {
  var getVideoHeightFromWave, getVideoIdFromWave, getVideoWidthFromWave, tryToLoadVideoFromWave, videoIdStoredInWave, youtubeApiReady, youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  tryToLoadVideoFromWave = function() {
    var videoShouldBeLoaded;
    videoShouldBeLoaded = videoIdStoredInWave() && !youtubeGadget.videoLoaded();
    if (videoShouldBeLoaded && youtubeApiReady()) {
      return youtubeGadget.loadVideoFromWave();
    } else if (videoShouldBeLoaded && !youtubeApiReady()) {
      return setTimeout(youtubeGadget.loadVideoFromWave, 1000);
    } else if (!videoIdStoredInWave()) {
      return youtubeGadget.showUrlEnterBox();
    }
  };

  videoIdStoredInWave = function() {
    return wave.getState().get("videoId") != null;
  };

  youtubeApiReady = function() {
    return YT.Player != null;
  };

  youtubeGadget.loadVideoFromWave = function() {
    var videoEnd, videoHeight, videoId, videoStart, videoWidth;
    videoId = getVideoIdFromWave();
    videoWidth = getVideoWidthFromWave();
    videoHeight = getVideoHeightFromWave();
    videoStart = youtubeGadget.getVideoStartFromWave();
    videoEnd = youtubeGadget.getVideoEndFromWave();
    youtubeGadget.loadPlayerWithVideoId(videoId, videoWidth, videoHeight, videoStart, videoEnd, youtubeGadget.adjustHeightOfGadget);
    return youtubeGadget.enterViewMode();
  };

  getVideoIdFromWave = function() {
    return wave.getState().get("videoId");
  };

  getVideoWidthFromWave = function() {
    return wave.getState().get("videoWidth") || 640;
  };

  getVideoHeightFromWave = function() {
    return wave.getState().get("videoHeight") || 390;
  };

  youtubeGadget.getVideoStartFromWave = function() {
    return wave.getState().get("videoStart") || null;
  };

  youtubeGadget.getVideoEndFromWave = function() {
    return wave.getState().get("videoEnd") || null;
  };

  youtubeGadget.storeVideoIdInWave = function(videoId) {
    return wave.getState().submitValue("videoId", videoId);
  };

  youtubeGadget.saveNewPlayerSizeToWave = function(size) {
    wave.getState().submitValue("videoWidth", size.width);
    return wave.getState().submitValue("videoHeight", size.height);
  };

  youtubeGadget.storeStartTimeInWave = function(startTime) {
    return wave.getState().submitValue("videoStart", startTime);
  };

  youtubeGadget.storeEndTimeInWave = function(endTime) {
    return wave.getState().submitValue("videoEnd", endTime);
  };

  wave.setStateCallback(tryToLoadVideoFromWave);

}).call(this);
