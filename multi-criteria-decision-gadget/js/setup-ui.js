(function() {
  var addTableBody, addTableHeader, addVotes, mcdgadget,
    __hasProp = {}.hasOwnProperty;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  mcdgadget.createTableInUI = function(options, criterias, votes) {
    addTableHeader(options);
    addTableBody(criterias, options);
    addVotes(votes);
    return gadgets.window.adjustHeight();
  };

  addTableHeader = function(options) {
    var optionId, optionName, tableHeader, tableRow;
    tableHeader = $("<thead><tr><th></th></tr></thead>");
    tableRow = tableHeader.find('tr');
    for (optionId in options) {
      if (!__hasProp.call(options, optionId)) continue;
      optionName = options[optionId];
      tableRow.append("<th contenteditable='true'>" + optionName + "</th>");
    }
    return $('#decision-table').append(tableHeader);
  };

  addTableBody = function(criterias, options) {
    var criterionId, criterionName, optionId, optionName, tableBody, tableRow;
    tableBody = $("<tbody></tbody>");
    for (criterionId in criterias) {
      if (!__hasProp.call(criterias, criterionId)) continue;
      criterionName = criterias[criterionId];
      tableRow = $('<tr></tr>');
      tableRow.append("<th contenteditable = 'true'>" + criterionName + "</th>");
      for (optionId in options) {
        if (!__hasProp.call(options, optionId)) continue;
        optionName = options[optionId];
        tableRow.append("<td data-criterion-option-id='" + criterionId + "|" + optionId + "'>                <div class='average-vote'>0</div>                <div class='slider-container'><div class='slider'></div><div class='slider-value'>0</div></div></td>");
      }
      tableBody.append(tableRow);
    }
    tableBody.find('.slider').slider({
      value: 0,
      min: -5,
      max: 5,
      slide: function(event, ui) {
        return $(event.target).next().text(ui.value);
      }
    });
    return $('#decision-table').append(tableBody);
  };

  addVotes = function(votes) {
    var criterionOptionId, hueValue, table, tableCell, voteData, _results;
    table = $('#decision-table');
    _results = [];
    for (criterionOptionId in votes) {
      if (!__hasProp.call(votes, criterionOptionId)) continue;
      voteData = votes[criterionOptionId];
      tableCell = table.find("td[data-criterion-option-id='" + criterionOptionId + "']");
      tableCell.find('.average-vote').text(voteData.averageVote);
      hueValue = 180 + ((60 * -voteData.averageVote) / 5);
      tableCell.css('background-color', "hsla(" + hueValue + ", 100%, 50%, 0.6)");
      _results.push(tableCell.css('color', "hsla(" + hueValue + ", 70%, 25%, 1)"));
    }
    return _results;
  };

  mcdgadget.updateTableInUI = function(criterias, options, votes) {
    return addVotes(votes);
  };

}).call(this);
