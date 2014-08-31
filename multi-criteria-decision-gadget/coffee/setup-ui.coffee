window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

mcdgadget.createTableInUI = (options, criterias, votes) ->
    addTableHeader(options)
    addTableBody(criterias, options)
    addVotes(votes)

addTableHeader = (options) ->
    tableHeader = $("<thead><tr><th></th></tr></thead>")
    tableRow = tableHeader.find('tr')
    for own optionId, optionName of options
        tableRow.append("<th contenteditable='true'>#{optionName}</th>")
        
    $('#decision-table').append(tableHeader)
        
    
addTableBody = (criterias, options) ->
    tableBody = $("<tbody></tbody>")
    for own criterionId, criterionName of criterias
        tableRow = $('<tr></tr>')
        tableRow.append("<th contenteditable = 'true'>#{criterionName}</th>")
        for own optionId, optionName of options
            tableRow.append("<td data-criterion-option-id='#{criterionId}|#{optionId}'>
                <div class='average-vote'>0</div>
                <div class='slider-container'><div class='slider'></div><div class='slider-value'>0</div></div></td>")
    
        tableBody.append(tableRow)
    
    tableBody.find('.slider').slider(
            {
              value:0,
              min: -5,
              max: 5,
              slide: ( event, ui ) ->
                # next sibling elementshould be slider value. in case of changes
                # can maybe be replaced by nextAll('.slider-value')
                $(event.target).next().text(ui.value)
            })
    $('#decision-table').append(tableBody)

addVotes = (votes) ->
    table = $('#decision-table')
    for own criterionOptionId, voteData of votes
        tableCell = table.find("td[data-criterion-option-id='#{criterionOptionId}']")
        tableCell.find('.average-vote').text(voteData.averageVote)
        # hue scale goes from +5(blue) at 240 to -5 (red) at 360 
        hueValue = 180 + ((60 * -voteData.averageVote) / 5) 
        tableCell.css('background-color', "hsla(#{hueValue}, 100%, 50%, 0.6)")
        tableCell.css('color', "hsla(#{hueValue}, 70%, 25%, 1)")
        
mcdgadget.updateTableInUI = (criterias, options, votes) ->
    addVotes(votes)