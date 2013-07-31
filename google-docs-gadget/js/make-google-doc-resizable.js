(function() {
  var googleDocGadget, makeDocResizable, makeDocUnresizable;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  googleDocGadget.docIsResizable = function() {
    return $('#googleDocDiv').hasClass('ui-resizable');
  };

  googleDocGadget.makeDocResizable = function() {
    if (!googleDocGadget.docIsResizable()) {
      return makeDocResizable();
    }
  };

  makeDocResizable = function() {
    return $('#googleDocDiv').resizable({
      handles: "s",
      grid: [1, 25],
      create: function(event, ui) {
        return gadgets.window.adjustHeight();
      },
      start: function(event, ui) {
        gadgets.window.adjustHeight();
        return $('#googleDocDiv').addClass('resizing');
      },
      resize: function(event, ui) {
        return gadgets.window.adjustHeight();
      },
      stop: function(event, ui) {
        gadgets.window.adjustHeight();
        googleDocGadget.saveHeightToWave(ui.size.height);
        return $('#googleDocDiv').removeClass('resizing');
      }
    });
  };

  googleDocGadget.makeDocUnresizable = function() {
    if (googleDocGadget.docIsResizable()) {
      return makeDocUnresizable();
    }
  };

  makeDocUnresizable = function() {
    $('#googleDocDiv').resizable('destroy');
    return gadgets.window.adjustHeight();
  };

}).call(this);
