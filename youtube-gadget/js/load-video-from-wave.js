(function() {
  var getVideoHeightFromWave, getVideoIdFromWave, getVideoWidthFromWave, loadVideoFromWave, showUrlEnterBox, videoIdStoredInWave, youtubeApiReady;

  window.loadVideoFromWave = function() {
    if (videoIdStoredInWave() && youtubeApiReady()) {
      return loadVideoFromWave();
    } else if (videoIdStoredInWave() && !youtubeApiReady()) {
      return setTimeout(window.loadVideoFromWave, 1000);
    } else {
      return showUrlEnterBox();
    }
  };

  videoIdStoredInWave = function() {
    return wave.getState().get("videoId") != null;
  };

  youtubeApiReady = function() {
    return YT.Player != null;
  };

  loadVideoFromWave = function() {
    var videoHeight, videoId, videoWidth;
    videoId = getVideoIdFromWave();
    videoWidth = getVideoWidthFromWave();
    videoHeight = getVideoHeightFromWave();
    console.log(videoWidth);
    console.log(videoHeight);
    return window.loadPlayerWithVideoId(videoId, videoWidth, videoHeight);
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

  window.loadPlayerWithVideoId = function(videoId, videoWidth, videoHeight) {
    var youtubePlayer;
    if (videoWidth == null) {
      videoWidth = 640;
    }
    if (videoHeight == null) {
      videoHeight = 390;
    }
    console.log(videoWidth);
    console.log(videoHeight);
    return youtubePlayer = new YT.Player('youtubePlayer', {
      width: videoWidth,
      height: videoHeight,
      videoId: videoId,
      events: {
        'onReady': function() {
          window.adjustHeightOfGadget();
          window.makeVideoResizable();
          return window.youtubePlayer = youtubePlayer;
        }
      }
    });
  };

  showUrlEnterBox = function() {
    return jQuery('#youtubeUrlText').show();
  };

  wave.setStateCallback(window.loadVideoFromWave);

}).call(this);
