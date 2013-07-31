(function() {
  var convertToSeconds, convertVideoSecondsToString, extractTimeFromString, extractTimeInSeconds, getCurrentPlayBackTime, getVideoLengthInSeconds, handleEndTimeTextChange, handleStartTimeTextChange, handleTimeTextChange, isTimeFormatCorrect, onClickStoreTimesToWave, pad, saveEnteredEndTime, saveEnteredStartTime, saveEnteredTime, saveTimesWhenEnterPressedOnTextField, saveTimesWhenTextFieldUnfocussed, setEndTimeOfButton, setStartTimeOfButton, setTimesOfButtons, showEnteredTime, showTimeButtons, showTimeEnteredWrongFormatMessage, showTimesWhenTimeTextChanged, startEndTimeSettable, youtubeGadget,
    __slice = [].slice;

  youtubeGadget = window.youtubeGadget || {};

  window.youtubeGadget = youtubeGadget;

  youtubeGadget.makeStartEndTimeSettable = function(startTime, endTime) {
    if (!startEndTimeSettable()) {
      youtubeGadget.showStartAndEndButtons(startTime, endTime);
      showTimesWhenTimeTextChanged();
      saveTimesWhenTextFieldUnfocussed();
      return saveTimesWhenEnterPressedOnTextField();
    }
  };

  startEndTimeSettable = function() {
    return $('.timeButtons').is(":visible");
  };

  youtubeGadget.showStartAndEndButtons = function(startTime, endTime) {
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

  pad = function(num, size) {
    var numberString;
    numberString = num + "";
    while (numberString.length < size) {
      numberString = "0" + numberString;
    }
    return numberString;
  };

  getVideoLengthInSeconds = function() {
    return youtubeGadget.youtubePlayer.getDuration();
  };

  youtubeGadget.hideStartEndButtons = function() {
    return $('.timeButtons').hide();
  };

  showTimesWhenTimeTextChanged = function() {
    $('#startTimeText').on('input', handleStartTimeTextChange);
    return $('#endTimeText').on('input', handleEndTimeTextChange);
  };

  handleStartTimeTextChange = function() {
    return handleTimeTextChange($('#startTimeText'), $('#startTimeFeedback'));
  };

  handleEndTimeTextChange = function() {
    return handleTimeTextChange($('#endTimeText'), $('#endTimeFeedback'));
  };

  handleTimeTextChange = function(inputTimeTextElement, feedbackElement) {
    var timeEntered, timeEnteredCorrectly, timeText;
    timeText = inputTimeTextElement.text();
    timeEnteredCorrectly = isTimeFormatCorrect(timeText);
    if (timeEnteredCorrectly) {
      timeEntered = extractTimeFromString(timeText);
      return showEnteredTime(timeEntered, feedbackElement);
    } else {
      return showTimeEnteredWrongFormatMessage(feedbackElement);
    }
  };

  showEnteredTime = function(time, element) {
    var hourOrHours, humanReadableTime;
    hourOrHours = time.hour !== 1 ? "hours" : "hour";
    humanReadableTime = "" + time.hours + " " + hourOrHours + " " + time.minutes + " min " + time.seconds + " sec";
    return element.text(humanReadableTime);
  };

  isTimeFormatCorrect = function(timeString) {
    return /^(?:[0-9]{1,2}:){0,2}[0-9]{1,2}$/.test(timeString);
  };

  extractTimeInSeconds = function(timeString) {
    var hoursMinutesAndSeconds, seconds;
    hoursMinutesAndSeconds = extractTimeFromString(timeString);
    seconds = convertToSeconds(hoursMinutesAndSeconds);
    return seconds;
  };

  extractTimeFromString = function(timeString) {
    var first, hours, last, mid, minutes, seconds, timeArrays, _i;
    timeArrays = timeString.split(":");
    first = timeArrays[0], mid = 3 <= timeArrays.length ? __slice.call(timeArrays, 1, _i = timeArrays.length - 1) : (_i = 1, []), last = timeArrays[_i++];
    hours = timeArrays.length > 2 ? first : "0";
    minutes = timeArrays.length > 2 ? mid[0] : timeArrays.length > 1 ? first : "0";
    seconds = timeArrays.length > 1 ? last : first;
    return {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds)
    };
  };

  showTimeEnteredWrongFormatMessage = function(element) {
    return element.text("Use hh:mm:ss");
  };

  saveTimesWhenTextFieldUnfocussed = function() {
    $('#startTimeText').on('blur', saveEnteredStartTime);
    return $('#endTimeText').on('blur', saveEnteredEndTime);
  };

  saveEnteredStartTime = function() {
    return saveEnteredTime($('#startTimeText'), $('#startTimeFeedback'), youtubeGadget.storeStartTimeInWave);
  };

  saveEnteredEndTime = function() {
    return saveEnteredTime($('#endTimeText'), $('#endTimeFeedback'), youtubeGadget.storeEndTimeInWave);
  };

  saveEnteredTime = function(inputElement, feedbackElement, storeFunction) {
    var timeInSeconds;
    if (isTimeFormatCorrect(inputElement.text())) {
      timeInSeconds = extractTimeInSeconds(inputElement.text());
      storeFunction(timeInSeconds);
      return feedbackElement.text("Saved");
    }
  };

  convertToSeconds = function(hoursMinutesAndSeconds) {
    return hoursMinutesAndSeconds.hours * 3600 + hoursMinutesAndSeconds.minutes * 60 + hoursMinutesAndSeconds.seconds;
  };

  saveTimesWhenEnterPressedOnTextField = function() {
    $('#startTimeText').keydown(function(event) {
      var enterPressed;
      enterPressed = event.which === 13;
      if (enterPressed) {
        event.preventDefault();
        return saveEnteredStartTime();
      }
    });
    return $('#endTimeText').keydown(function(event) {
      var enterPressed;
      enterPressed = event.which === 13;
      if (enterPressed) {
        event.preventDefault();
        return saveEnteredEndTime();
      }
    });
  };

}).call(this);
