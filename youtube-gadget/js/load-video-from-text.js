(function() {

  jQuery(document).ready(function($) {
    var extractYoutubeVideoId, giveWrongUrlWarning, loadYoutubePlayerByUrlInTextBox, loadYoutubeUrlOnEnter, loadYoutubeUrlOnPaste, removeTextField, storeVideoIdInWave, urlIsYoutubeVideo, youtubePlayer;
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
        window.loadPlayerWithVideoId(youtubeVideoId);
        return storeVideoIdInWave(youtubeVideoId);
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
    storeVideoIdInWave = function(videoId) {
      return wave.getState().submitValue("videoId", videoId);
    };
    giveWrongUrlWarning = function(url) {
      return alert("Could not use " + url + ", please check if " + url + " is a youtube video url :)");
    };
    window.adjustHeightOfGadget = function() {
      return gadgets.window.adjustHeight();
    };
    loadYoutubeUrlOnEnter();
    return loadYoutubeUrlOnPaste();
  });

}).call(this);
