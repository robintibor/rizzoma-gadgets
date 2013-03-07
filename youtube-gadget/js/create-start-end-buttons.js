(function() {
  var convertVideoSecondsToString, getCurrentPlayBackTime, getVideoLengthInSeconds, onClickStoreTimesToWave, pad, setEndTimeOfButton, setStartTimeOfButton, setTimesOfButtons, showTimeButtons, youtubeGadget;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  youtubeGadget.showStartAndEndButtons = function(startTime, endTime) {
    console.log("startTime", startTime);
    setTimesOfButtons(startTime, endTime);
    showTimeButtons();
    return onClickStoreTimesToWave();
  };

  showTimeButtons = function() {
    return $('.timeButtons').show();
  };

  onClickStoreTimesToWave = function() {
    $('#startTimeButton').click(function() {
      var playbackTime;
      playbackTime = getCurrentPlayBackTime();
      setStartTimeOfButton(playbackTime);
      return youtubeGadget.storeStartTimeInWave(playbackTime);
    });
    return $('#endTimeButton').click(function() {
      var playbackTime;
      playbackTime = getCurrentPlayBackTime();
      setEndTimeOfButton(playbackTime);
      return youtubeGadget.storeEndTimeInWave(playbackTime);
    });
  };

  getCurrentPlayBackTime = function() {
    return Math.round(youtubeGadget.youtubePlayer.getCurrentTime());
  };

  setTimesOfButtons = function(startTime, endTime) {
    if (startTime != null) {
      setStartTimeOfButton(startTime);
    } else {
      setStartTimeOfButton(0);
    }
    if (endTime != null) {
      return setEndTimeOfButton(endTime);
    } else {
      return setEndTimeOfButton(getVideoLengthInSeconds());
    }
  };

  setStartTimeOfButton = function(startTime) {
    var timeString;
    timeString = convertVideoSecondsToString(startTime);
    return $('#startTimeText').text(timeString);
  };

  setEndTimeOfButton = function(endTime) {
    var timeString;
    timeString = convertVideoSecondsToString(endTime);
    return $('#endTimeText').text(timeString);
  };

  convertVideoSecondsToString = function(seconds) {
    var hours, minutes;
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (hours > 0) {
      return "" + hours + ":" + (pad(minutes, 2)) + ":" + (pad(seconds, 2));
    } else {
      return "" + (pad(minutes, 2)) + ":" + (pad(seconds, 2));
    }
  };

  getVideoLengthInSeconds = function() {
    return youtubeGadget.youtubePlayer.getDuration();
  };

  pad = function(num, size) {
    var numberString;
    numberString = num + "";
    while (numberString.length < size) {
      numberString = "0" + numberString;
    }
    return numberString;
  };

}).call(this);
