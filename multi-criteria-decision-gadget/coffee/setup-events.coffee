window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

mcdgadget.setupEventsForTable  = ->
    setupVoteEvents()
    #setupTextChangeEvents()
    
setupVoteEvents = ->
    # go through all sliders
    sliders = $('#decision-table .slider')
    for slider in sliders
        criterionAndOption = determineCriterionAndOption(slider)
        # necessary to call function to avoid closure problems
        # (otherwise criterionAndOption would have the value
        # of the last iteration of the loop in all callbacks)
        setupVoting(slider, criterionAndOption)
        
determineCriterionAndOption = (slider) ->
    tableCell = $(slider).parent().parent()
    return tableCell.attr('data-criterion-option-id')

setupVoting = (slider, criterionAndOption) ->
    $(slider).on('slidechange', 
        (event, ui) ->
            mcdgadget.updateVote(criterionAndOption, ui.value)
    )