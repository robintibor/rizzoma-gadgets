googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget

googleDocGadget.docIsResizable = ->
  return $('#googleDocDiv').hasClass('ui-resizable')

googleDocGadget.makeDocResizable = ->
  $('#googleDocDiv').resizable(
    {
      handles: "s",
      grid: [1, 50],
      create: (event, ui) ->
        gadgets.window.adjustHeight($('body').height() + 5)
      start: (event, ui) ->
        gadgets.window.adjustHeight($('body').height() + 100)
        $('#googleDocDiv').addClass('resizing')
        console.log("start resize")        
      resize: (event, ui) ->
        gadgets.window.adjustHeight($('body').height() + 100)
      stop: (event, ui) ->
        gadgets.window.adjustHeight($('body').height() + 5)
        googleDocGadget.saveHeightToWave(ui.size.height)
        $('#googleDocDiv').removeClass('resizing')
    }
  )
