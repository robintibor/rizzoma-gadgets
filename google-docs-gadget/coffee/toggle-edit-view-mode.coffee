googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget


VIEW_MODE = 1
EDIT_MODE = 2

showHideResizeBarWhenModeChanged = ->  
  wave.setModeCallback(showHideResizeBar)

showHideResizeBar = ->
  mode = wave.getMode()
  if (mode == EDIT_MODE)
    googleDocGadget.makeDocResizable()
    $('body').addClass('editMode')
    $('body').removeClass('viewMode')
  if (mode == VIEW_MODE)
    googleDocGadget.makeDocUnresizable()
    $('body').addClass('viewMode')
    $('body').removeClass('editMode')
  

showHideResizeBarWhenModeChanged()