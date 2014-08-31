window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

mcdgadget.createTable = (state) ->
    options = extractOptions(state)
    criterias = extractCriterias(state)
    votes = extractVotes(state)        
    mcdgadget.createTableInUI(options, criterias, votes)
    
    
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
    return {}
    