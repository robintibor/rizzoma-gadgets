(function() {
  var extractCriterias, extractOptions, extractVotes, mcdgadget;

  window.mcdgadget = window.mcdgadget || {};

  mcdgadget = window.mcdgadget;

  mcdgadget.createTable = function(state) {
    var criterias, options, votes;
    options = extractOptions(state);
    criterias = extractCriterias(state);
    votes = extractVotes(state);
    return mcdgadget.createTableInUI(options, criterias, votes);
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
    return {};
  };

}).call(this);
