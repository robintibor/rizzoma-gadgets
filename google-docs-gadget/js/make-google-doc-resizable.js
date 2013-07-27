(function() {
  var googleDocGadget;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  googleDocGadget.docIsResizable = function() {
    return $('#googleDocDiv').hasClass('ui-resizable');
  };

  googleDocGadget.makeDocResizable = function() {
    return $('#googleDocDiv').resizable({
      handles: "s",
      grid: [1, 50],
      create: function(event, ui) {
        return gadgets.window.adjustHeight($('body').height() + 5);
      },
      start: function(event, ui) {
        gadgets.window.adjustHeight($('body').height() + 100);
        $('#googleDocDiv').addClass('resizing');
        return console.log("start resize");
      },
      resize: function(event, ui) {
        return gadgets.window.adjustHeight($('body').height() + 100);
      },
      stop: function(event, ui) {
        gadgets.window.adjustHeight($('body').height() + 5);
        googleDocGadget.saveHeightToWave(ui.size.height);
        return $('#googleDocDiv').removeClass('resizing');
      }
    });
  };

}).call(this);
