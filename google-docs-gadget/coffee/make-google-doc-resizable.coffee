googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget

googleDocGadget.docIsResizable = ->
  return $('#googleDocDiv').hasClass('ui-resizable')

googleDocGadget.makeDocResizable = ->
  if (not googleDocGadget.docIsResizable())
    makeDocResizable()

makeDocResizable = ->
  $('#googleDocDiv').resizable(
      {
        handles: "s",
        grid: [1, 25],
        create: (event, ui) ->
          gadgets.window.adjustHeight()
        start: (event, ui) ->
          gadgets.window.adjustHeight()
          $('#googleDocDiv').addClass('resizing')
        resize: (event, ui) ->
          gadgets.window.adjustHeight()
        stop: (event, ui) ->
          gadgets.window.adjustHeight()
          googleDocGadget.saveHeightToWave(ui.size.height)
          $('#googleDocDiv').removeClass('resizing')
      }
    )

googleDocGadget.makeDocUnresizable = ->
  if (googleDocGadget.docIsResizable())
    makeDocUnresizable()

makeDocUnresizable = ->
    $('#googleDocDiv').resizable('destroy')
    gadgets.window.adjustHeight()
  