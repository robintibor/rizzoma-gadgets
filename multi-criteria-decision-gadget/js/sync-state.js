(function() {
  var createFirstState, createTable, criteriaIdToName, handleNewState, mcdgadget, stateIsEmpty, tableCreatedBefore;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  criteriaIdToName = {};

  tableCreatedBefore = false;

  handleNewState = function() {
    console.log("hi, this is a new state");
    if (!stateIsEmpty()) {
      if (tableCreatedBefore) {
        return updateTable();
      } else {
        return createTable();
      }
    } else {
      return createFirstState();
    }
  };

  stateIsEmpty = function() {
    return wave.getState().getKeys().length === 0;
  };

  createFirstState = function() {
    var firstState;
    firstState = {
      crit_1: "First Criterion",
      opt_1: "First Option"
    };
    return wave.getState().submitDelta(firstState);
  };

  createTable = function() {
    var state;
    state = wave.getState();
    return mcdgadget.createTable(state);
  };

  wave.setStateCallback(handleNewState);

}).call(this);
