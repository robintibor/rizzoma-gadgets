(function() {
  var makeGadgetWindowBigger;

  makeGadgetWindowBigger = function() {
    return gadgets.window.adjustHeight(500);
  };

  gadgets.util.registerOnLoadHandler(makeGadgetWindowBigger);

}).call(this);
