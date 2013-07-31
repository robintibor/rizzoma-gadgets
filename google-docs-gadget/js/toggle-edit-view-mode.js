(function() {
  var EDIT_MODE, VIEW_MODE, googleDocGadget, showHideResizeBar, showHideResizeBarWhenModeChanged;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  VIEW_MODE = 1;

  EDIT_MODE = 2;

  showHideResizeBarWhenModeChanged = function() {
    return wave.setModeCallback(showHideResizeBar);
  };

  showHideResizeBar = function() {
    var mode;
    mode = wave.getMode();
    if (mode === EDIT_MODE) {
      googleDocGadget.makeDocResizable();
      $('body').addClass('editMode');
      $('body').removeClass('viewMode');
    }
    if (mode === VIEW_MODE) {
      googleDocGadget.makeDocUnresizable();
      $('body').addClass('viewMode');
      return $('body').removeClass('editMode');
    }
  };

  showHideResizeBarWhenModeChanged();

}).call(this);
