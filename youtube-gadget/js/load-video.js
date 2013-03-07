(function() {

  jQuery(document).ready(function($) {
    var createPlayerVariables, extractYoutubeVideoId, giveWrongUrlWarning, loadYoutubePlayerByUrlInTextBox, loadYoutubeUrlOnEnter, loadYoutubeUrlOnPaste, removeTextField, urlIsYoutubeVideo, youtubeGadget, youtubePlayer;
    youtubeGadget = window.youtubeGadget || {};
    window.youtubeGadget = youtubeGadget;
    youtubePlayer = null;
    loadYoutubeUrlOnEnter = function() {
      return $('#youtubeUrlText').keyup(function(event) {
        var enterKeyCode;
        enterKeyCode = 13;
        if (event.keyCode === enterKeyCode) {
          return loadYoutubePlayerByUrlInTextBox();
        }
      });
    };
    loadYoutubeUrlOnPaste = function() {
      return $('#youtubeUrlText').on("paste", function() {
        return setTimeout(loadYoutubePlayerByUrlInTextBox, 0);
      });
    };
    loadYoutubePlayerByUrlInTextBox = function() {
      var enteredUrl, trimmedUrl, youtubeVideoId;
      enteredUrl = $('#youtubeUrlText').val();
      trimmedUrl = enteredUrl.trim();
      if (urlIsYoutubeVideo(trimmedUrl)) {
        removeTextField();
        youtubeVideoId = extractYoutubeVideoId(trimmedUrl);
        youtubeGadget.loadPlayerWithVideoId(youtubeVideoId);
        return youtubeGadget.storeVideoIdInWave(youtubeVideoId);
      } else {
        return giveWrongUrlWarning(trimmedUrl);
      }
    };
    urlIsYoutubeVideo = function(url) {
      return extractYoutubeVideoId(url) !== null;
    };
    extractYoutubeVideoId = function(url) {
      var match, regExp;
      regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      match = url.match(regExp);
      if (match && match[7].length === 11) {
        return match[7];
      } else {
        return null;
      }
    };
    removeTextField = function() {
      return $('#youtubeUrlText').remove();
    };
    giveWrongUrlWarning = function(url) {
      return alert("Could not use " + url + ", please check if " + url + " is a youtube video url :)");
    };
    youtubeGadget.loadPlayerWithVideoId = function(videoId, videoWidth, videoHeight, videoStart, videoEnd) {
      var playerVariables;
      if (videoWidth == null) {
        videoWidth = 640;
      }
      if (videoHeight == null) {
        videoHeight = 390;
      }
      playerVariables = createPlayerVariables(videoStart, videoEnd);
      return youtubePlayer = new YT.Player('youtubePlayer', {
        width: videoWidth,
        height: videoHeight,
        videoId: videoId,
        playerVars: playerVariables,
        events: {
          'onReady': function() {
            youtubeGadget.youtubePlayer = youtubePlayer;
            youtubeGadget.adjustHeightOfGadget();
            youtubeGadget.makeVideoResizable();
            return youtubeGadget.showStartAndEndButtons(videoStart, videoEnd);
          }
        }
      });
    };
    createPlayerVariables = function(videoStart, videoEnd) {
      var playerVariables;
      playerVariables = {};
      if (videoStart != null) {
        playerVariables.start = videoStart;
      }
      if (videoEnd != null) {
        playerVariables.end = videoEnd;
      }
      return playerVariables;
    };
    youtubeGadget.videoLoaded = function() {
      return youtubePlayer != null;
    };
    youtubeGadget.showUrlEnterBox = function() {
      return jQuery('#youtubeUrlText').show();
    };
    youtubeGadget.adjustHeightOfGadget = function() {
      return gadgets.window.adjustHeight();
    };
    loadYoutubeUrlOnEnter();
    return loadYoutubeUrlOnPaste();
  });

}).call(this);
