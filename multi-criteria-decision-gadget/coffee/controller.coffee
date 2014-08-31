window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

mcdgadget.createTable = (state) ->
    options = extractOptions(state)
    criterias = extractCriterias(state)
    votes = extractVotes(state)        
    mcdgadget.createTableInUI(options, criterias, votes)
    mcdgadget.setupEventsForTable()
    
extractOptions = (state) ->
    options = {}
    for key in state.getKeys()
        if key.match('^opt_')
            options[key] = state.get(key)
    return options
    
extractCriterias = (state) ->
    criterias = {}
    for key in state.getKeys()
        if key.match('^crit_')
            criterias[key] = state.get(key)
    return criterias

extractVotes = (state) ->
    votes = {}
    # votes have the form userid|critid|optid
    for key in state.getKeys()
        parts = key.split("|")
        if (parts.length == 3)
            userId = parts[0]
            # recover crioterionOptionId as stored in html data attribute
            criterionOptionId = "#{parts[1]}|#{parts[2]}"
            voteValue = state.get(key)
            if (not votes[criterionOptionId]?)
                votes[criterionOptionId] =  {individualVotes: {}, averageVote: 0}
            votes[criterionOptionId].individualVotes[userId] = voteValue
    # add average votes
    for own criterionOptionId, voteData of votes
        numberOfVotes = 0
        sumOfVotes = 0
        for own userId, vote of voteData.individualVotes
            sumOfVotes += vote
            numberOfVotes += 1
        votes[criterionOptionId].averageVote = sumOfVotes/numberOfVotes
    return votes
            

mcdgadget.updateTable = (state) ->
    options = extractOptions(state)
    criterias = extractCriterias(state)
    votes = extractVotes(state)
    mcdgadget.updateTableInUI(options, criterias, votes)