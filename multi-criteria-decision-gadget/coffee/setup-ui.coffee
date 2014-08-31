window.mcdgadget = window.mcdgadget || {}
mcdgadget = window.mcdgadget

mcdgadget.createTableInUI = (options, criterias, votes) ->
    console.log("options", options)
    console.log("criterias", criterias)
    console.log("votes", votes)
    addTableHeader(options)
    addTableBody(criterias, Object.keys(options).length)

addTableHeader = (options) ->
    tableHeader = $("<thead><tr><th></th></tr></thead>")
    
    tableRow = tableHeader.find('tr')
    console.log(tableRow)
    for own optionId, optionName of options
        tableRow.append("<th contenteditable='true'>#{optionName}</th>")
        
    $('#decision-table').append(tableHeader)
        
    
addTableBody = (criterias, numberOfOptions) ->
    tableBody = $("<tbody></tbody>")
    console.log("number of options", numberOfOptions)
    for own criterionId, criterionName of criterias
        tableRow = $('<tr></tr>')
        tableRow.append("<td contenteditable = 'true'>#{criterionName}</td>")
        for i in [0...numberOfOptions]
            console.log("appending slider cell")
            tableRow.append("<td><div class='slider'></div><div class='slider-value'>0</div></td>")
    
        tableBody.append(tableRow)
    
    tableBody.find('.slider').slider(
            {
              value:0,
              min: -5,
              max: 5,
              slide: ( event, ui ) ->
                $( ".slider-value" ).text(ui.value)
            })
    
    $('#decision-table').append(tableBody)
    
    
    
    ###"<tbody>
            <tr>
                <td contenteditable="true">Criteria A</td>
                <td>
                    <div class="slider"></div> 
                    <div class="slider-value">0</div>
                </td>
            </tr>
        </tbody>
    "###


$('.slider').slider(
            {
              value:0,
              min: -5,
              max: 5,
              slide: ( event, ui ) ->
                $( ".slider-value" ).text(ui.value)
            });