window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

criteriaIdToName = {}
tableCreatedBefore = false

handleNewState = () ->
    if (not stateIsEmpty())
        if (tableCreatedBefore)
            updateTable()
        else
            createTable()
            tableCreatedBefore = true
    else
        createFirstState()

stateIsEmpty = ->
    wave.getState().getKeys().length == 0

createFirstState = () ->
    firstState = {
        crit_1: "First Criterion", crit_2: "Second Criterion",
        opt_1: "First Option",
    }
    wave.getState().submitDelta(firstState)

createTable = ->
    state = wave.getState()
    mcdgadget.createTable(state)

updateTable = ->
    state = wave.getState()
    mcdgadget.updateTable(state)

mcdgadget.updateVote = (criterionAndOption, newValue) ->
    userId = wave.getViewer().getId()
    if (not userInfoStored(userId))
        storeUserInfo(userId)
    wave.getState().submitValue("#{userId}|#{criterionAndOption}", newValue)

userInfoStored = (userId) ->
    return wave.getState().get(userId)?

storeUserInfo = (userId) ->
    userName = wave.getParticipantById(userId).getDisplayName()
    wave.getState().submitValue(userId, userName)

wave.setStateCallback(handleNewState)