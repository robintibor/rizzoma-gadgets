window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

criteriaIdToName = {}
tableCreatedBefore = false

handleNewState = () ->
    console.log("hi, this is a new state")
    if (not stateIsEmpty())
        if (tableCreatedBefore)
            updateTable()
        else
            createTable()
    else
        createFirstState()

stateIsEmpty = ->
    wave.getState().getKeys().length == 0

createFirstState = () ->
    firstState = {
        crit_1: "First Criterion",
        opt_1: "First Option",
    }
    wave.getState().submitDelta(firstState)

createTable = ->
    state = wave.getState()
    mcdgadget.createTable(state)

wave.setStateCallback(handleNewState)