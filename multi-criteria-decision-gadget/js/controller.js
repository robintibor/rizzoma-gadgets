(function() {
  var extractCriterias, extractOptions, extractVotes, mcdgadget,
    __hasProp = {}.hasOwnProperty;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  mcdgadget.createTable = function(state) {
    var criterias, options, votes;
    options = extractOptions(state);
    criterias = extractCriterias(state);
    votes = extractVotes(state);
    mcdgadget.createTableInUI(options, criterias, votes);
    return mcdgadget.setupEventsForTable();
  };

  extractOptions = function(state) {
    var key, options, _i, _len, _ref;
    options = {};
    _ref = state.getKeys();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (key.match('^opt_')) {
        options[key] = state.get(key);
      }
    }
    return options;
  };

  extractCriterias = function(state) {
    var criterias, key, _i, _len, _ref;
    criterias = {};
    _ref = state.getKeys();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (key.match('^crit_')) {
        criterias[key] = state.get(key);
      }
    }
    return criterias;
  };

  extractVotes = function(state) {
    var criterionOptionId, key, numberOfVotes, parts, sumOfVotes, userId, vote, voteData, voteValue, votes, _i, _len, _ref, _ref1;
    votes = {};
    _ref = state.getKeys();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      parts = key.split("|");
      if (parts.length === 3) {
        userId = parts[0];
        criterionOptionId = "" + parts[1] + "|" + parts[2];
        voteValue = state.get(key);
        if (votes[criterionOptionId] == null) {
          votes[criterionOptionId] = {
            individualVotes: {},
            averageVote: 0
          };
        }
        votes[criterionOptionId].individualVotes[userId] = voteValue;
      }
    }
    for (criterionOptionId in votes) {
      if (!__hasProp.call(votes, criterionOptionId)) continue;
      voteData = votes[criterionOptionId];
      numberOfVotes = 0;
      sumOfVotes = 0;
      _ref1 = voteData.individualVotes;
      for (userId in _ref1) {
        if (!__hasProp.call(_ref1, userId)) continue;
        vote = _ref1[userId];
        sumOfVotes += vote;
        numberOfVotes += 1;
      }
      votes[criterionOptionId].averageVote = sumOfVotes / numberOfVotes;
    }
    return votes;
  };

  mcdgadget.updateTable = function(state) {
    var criterias, options, votes;
    options = extractOptions(state);
    criterias = extractCriterias(state);
    votes = extractVotes(state);
    return mcdgadget.updateTableInUI(options, criterias, votes);
  };

}).call(this);
