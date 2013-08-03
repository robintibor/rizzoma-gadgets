youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget


youtubeGadget.makeStartEndTimeSettable = (startTime, endTime) ->
  if (not startEndTimeSettable())
    youtubeGadget.showStartAndEndButtons(startTime, endTime)
    showTimesWhenTimeTextChanged()
    saveTimesWhenTextFieldUnfocussed()
    saveTimesWhenEnterPressedOnTextField()

startEndTimeSettable = ->
  # for now, just determine if start/endtime settable by visiblity of timebuttons
  return $('.timeButtons').is(":visible")

youtubeGadget.showStartAndEndButtons = (startTime, endTime) ->
  setTimesOfButtons(startTime, endTime)
  showTimeButtons()
  onClickStoreTimesToWave()

showTimeButtons = ->
  $('.timeButtons').show()
  
onClickStoreTimesToWave = ->
  $('#startTimeButton').click( () ->
    playbackTime = getCurrentPlayBackTime()
    setStartTimeOfButton(playbackTime)
    youtubeGadget.storeStartTimeInWave(playbackTime)
  )
  
  $('#endTimeButton').click( () ->
    playbackTime = getCurrentPlayBackTime()
    setEndTimeOfButton(playbackTime)
    youtubeGadget.storeEndTimeInWave(playbackTime)
  )
  
getCurrentPlayBackTime = ->
  # playback time in seconds...
  return Math.round(youtubeGadget.youtubePlayer.getCurrentTime())

setTimesOfButtons = (startTime, endTime) ->
  if startTime?
    setStartTimeOfButton(startTime)
  else
    setStartTimeOfButton(0)
  if endTime?
    setEndTimeOfButton(endTime)
  else
    setEndTimeOfButton(getVideoLengthInSeconds())

setStartTimeOfButton = (startTime) ->
  timeString = convertVideoSecondsToString(startTime)
  $('#startTimeText').text(timeString)

setEndTimeOfButton = (endTime) ->
  timeString = convertVideoSecondsToString(endTime)
  $('#endTimeText').text(timeString)

convertVideoSecondsToString = (seconds) ->
  hours= Math.floor(seconds / 3600)
  minutes = Math.floor(seconds / 60)
  seconds = seconds % 60
  return if (hours > 0) then "#{hours}:#{pad(minutes, 2)}:#{pad(seconds, 2)}" else "#{pad(minutes, 2)}:#{pad(seconds, 2)}"

pad = (num, size) ->
    numberString = num + ""
    while (numberString.length < size) 
      numberString = "0" + numberString
    return numberString

getVideoLengthInSeconds = ->
  return youtubeGadget.youtubePlayer.getDuration()

youtubeGadget.hideStartEndButtons = ->
  $('.timeButtons').hide()

showTimesWhenTimeTextChanged = ->
  $('#startTimeText').on('input', handleStartTimeTextChange)
  $('#endTimeText').on('input', handleEndTimeTextChange)

handleStartTimeTextChange = ->
  handleTimeTextChange($('#startTimeText'), $('#startTimeFeedback'))

handleEndTimeTextChange = ->
  handleTimeTextChange($('#endTimeText'), $('#endTimeFeedback'))

handleTimeTextChange = (inputTimeTextElement, feedbackElement) ->
  timeText = inputTimeTextElement.text()
  timeEnteredCorrectly = isTimeFormatCorrect(timeText)
  if (timeEnteredCorrectly)
    timeEntered = extractTimeFromString(timeText)
    showEnteredTime(timeEntered, feedbackElement)
  else
    showTimeEnteredWrongFormatMessage(feedbackElement)

showEnteredTime = (time, element) ->
  hourOrHours = if time.hour != 1 then "hours" else "hour"
  humanReadableTime = "#{time.hours} #{hourOrHours} #{time.minutes} min #{time.seconds} sec"
  element.text(humanReadableTime)

isTimeFormatCorrect = (timeString) ->
  # I allow minutes hours seconds to be bigger than 60 for simplicity...
  # Also they will be converted corretly to seconds anyways.. and
  # stored as seconds
  return /^(?:[0-9]{1,2}:){0,2}[0-9]{1,2}$/.test(timeString)

extractTimeInSeconds = (timeString) ->
  hoursMinutesAndSeconds = extractTimeFromString(timeString)
  seconds = convertToSeconds(hoursMinutesAndSeconds)
  return seconds

extractTimeFromString = (timeString) ->
  timeArrays = timeString.split(":")
  [first, mid..., last] = timeArrays
  # hour only given when timearray has 3 elements
  hours = if timeArrays.length > 2 then first else "0"
  # if hour given, minutes are in middle, otherwise minutes are in first place of array
  minutes = if timeArrays.length > 2 then mid[0] else if timeArrays.length > 1 then first else "0"
  # if hour or minute given, seconds are last element, otherwise first
  seconds = if timeArrays.length > 1 then last else first
  return {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds)
  }
  
showTimeEnteredWrongFormatMessage = (element) ->
  element.text("Use hh:mm:ss")
  
saveTimesWhenTextFieldUnfocussed = ->
  $('#startTimeText').on('blur', saveEnteredStartTime)
  $('#endTimeText').on('blur', saveEnteredEndTime)

saveEnteredStartTime = ->
  saveEnteredTime($('#startTimeText'), $('#startTimeFeedback'),
    youtubeGadget.getVideoStartFromWave, youtubeGadget.storeStartTimeInWave)

saveEnteredEndTime = ->
  saveEnteredTime($('#endTimeText'), $('#endTimeFeedback'), 
    youtubeGadget.getVideoEndFromWave, youtubeGadget.storeEndTimeInWave)
  
saveEnteredTime = (inputElement, feedbackElement, getFunction, storeFunction) ->
  # check whether entered timestirng is a correct timestring
  # and whether entered time is actually different froms tored time
  # if yes, store it
  if (isTimeFormatCorrect(inputElement.text()))
    enteredTimeInSeconds = extractTimeInSeconds(inputElement.text())
    storedTimeInSeconds = getFunction()
    if (enteredTimeInSeconds != storedTimeInSeconds)
      storeFunction(enteredTimeInSeconds)
      feedbackElement.text("Saved")

convertToSeconds = (hoursMinutesAndSeconds) ->
  return hoursMinutesAndSeconds.hours * 3600 + hoursMinutesAndSeconds.minutes * 60 + 
    hoursMinutesAndSeconds.seconds

saveTimesWhenEnterPressedOnTextField = ->
  $('#startTimeText').keydown((event) ->
    enterPressed = event.which == 13
    if (enterPressed)
      event.preventDefault()
      saveEnteredStartTime()
  )
  $('#endTimeText').keydown((event) ->
    enterPressed = event.which == 13
    if (enterPressed)
      event.preventDefault()
      saveEnteredEndTime()
  )