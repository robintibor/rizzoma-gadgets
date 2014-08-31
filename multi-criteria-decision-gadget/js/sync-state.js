(function() {
  var createFirstState, createTable, criteriaIdToName, handleNewState, mcdgadget, stateIsEmpty, storeUserInfo, tableCreatedBefore, updateTable, userInfoStored;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  criteriaIdToName = {};

  tableCreatedBefore = false;

  handleNewState = function() {
    if (!stateIsEmpty()) {
      if (tableCreatedBefore) {
        return updateTable();
      } else {
        createTable();
        return tableCreatedBefore = true;
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
      crit_2: "Second Criterion",
      opt_1: "First Option"
    };
    return wave.getState().submitDelta(firstState);
  };

  createTable = function() {
    var state;
    state = wave.getState();
    return mcdgadget.createTable(state);
  };

  updateTable = function() {
    var state;
    state = wave.getState();
    return mcdgadget.updateTable(state);
  };

  mcdgadget.updateVote = function(criterionAndOption, newValue) {
    var userId;
    userId = wave.getViewer().getId();
    if (!userInfoStored(userId)) {
      storeUserInfo(userId);
    }
    return wave.getState().submitValue("" + userId + "|" + criterionAndOption, newValue);
  };

  userInfoStored = function(userId) {
    return wave.getState().get(userId) != null;
  };

  storeUserInfo = function(userId) {
    var userName;
    userName = wave.getParticipantById(userId).getDisplayName();
    return wave.getState().submitValue(userId, userName);
  };

  wave.setStateCallback(handleNewState);

}).call(this);
