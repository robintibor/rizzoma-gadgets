(function() {
  var addTableBody, addTableHeader, mcdgadget,
    __hasProp = {}.hasOwnProperty;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  mcdgadget.createTableInUI = function(options, criterias, votes) {
    console.log("options", options);
    console.log("criterias", criterias);
    console.log("votes", votes);
    addTableHeader(options);
    return addTableBody(criterias, options.length);
  };

  addTableHeader = function(options) {
    var optionId, optionName, tableHeader, tableRow;
    tableHeader = $("<thead><tr><th></th></tr></thead>");
    tableRow = tableHeader.find('tr');
    console.log(tableRow);
    for (optionId in options) {
      if (!__hasProp.call(options, optionId)) continue;
      optionName = options[optionId];
      tableRow.append("<th contenteditable='true'>" + optionName + "</th>");
    }
    return $('#decision-table').append(tableHeader);
  };

  addTableBody = function(criterias, numberOfOptions) {
    var criterionId, criterionName, i, tableBody, tableRow, _i;
    tableBody = $("<tbody></tbody>");
    for (criterionId in criterias) {
      if (!__hasProp.call(criterias, criterionId)) continue;
      criterionName = criterias[criterionId];
      tableRow = $('<tr></tr>');
      tableRow.append("<td contenteditable = 'true'>" + criterionName + "</td>");
      for (i = _i = 0; 0 <= numberOfOptions ? _i < numberOfOptions : _i > numberOfOptions; i = 0 <= numberOfOptions ? ++_i : --_i) {
        tableRow.append("<td><div class='slider'></div><div class='slider-value'></div></td>");
      }
      tableBody.append(tableRow);
    }
    tableBody.find('.slider').slider({
      value: 0,
      min: -5,
      max: 5,
      slide: function(event, ui) {
        return $(".slider-value").text(ui.value);
      }
    });
    return $('#decision-table').append(tableBody);
    /*"<tbody>
            <tr>
                <td contenteditable="true">Criteria A</td>
                <td>
                    <div class="slider"></div> 
                    <div class="slider-value">0</div>
                </td>
            </tr>
        </tbody>
    "
    */

  };

  $('.slider').slider({
    value: 0,
    min: -5,
    max: 5,
    slide: function(event, ui) {
      return $(".slider-value").text(ui.value);
    }
  });

}).call(this);
