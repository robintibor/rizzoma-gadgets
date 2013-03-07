youtubeGadget = window.youtubeGadget || {}
window.youtubeGadget = youtubeGadget

youtubeGadget.showStartAndEndButtons = (startTime, endTime) ->
  console.log("startTime", startTime)
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

getVideoLengthInSeconds = ->
  return youtubeGadget.youtubePlayer.getDuration()

pad = (num, size) ->
    numberString = num + ""
    while (numberString.length < size) 
      numberString = "0" + numberString
    return numberString
  