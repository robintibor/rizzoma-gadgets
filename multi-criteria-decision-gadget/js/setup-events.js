(function() {
  var determineCriterionAndOption, mcdgadget, setupVoteEvents, setupVoting;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  mcdgadget.setupEventsForTable = function() {
    return setupVoteEvents();
  };

  setupVoteEvents = function() {
    var criterionAndOption, slider, sliders, _i, _len, _results;
    sliders = $('#decision-table .slider');
    _results = [];
    for (_i = 0, _len = sliders.length; _i < _len; _i++) {
      slider = sliders[_i];
      criterionAndOption = determineCriterionAndOption(slider);
      _results.push(setupVoting(slider, criterionAndOption));
    }
    return _results;
  };

  determineCriterionAndOption = function(slider) {
    var tableCell;
    tableCell = $(slider).parent().parent();
    return tableCell.attr('data-criterion-option-id');
  };

  setupVoting = function(slider, criterionAndOption) {
    return $(slider).on('slidechange', function(event, ui) {
      return mcdgadget.updateVote(criterionAndOption, ui.value);
    });
  };

}).call(this);
