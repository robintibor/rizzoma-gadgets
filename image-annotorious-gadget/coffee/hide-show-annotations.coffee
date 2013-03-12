imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget

jQuery(document).ready(($) ->
  createToggleButton = ->
    $("#toggleAnnotationsCheckBox").button()
  
  hideOrShowAnnotationsOnClick = ->
    $("#toggleAnnotationsCheckBox").click(hideOrShowAnnotations)
  
  hideOrShowAnnotations = ->
    if (checkboxIsChecked())
      showAnnotations()
    else
      hideAnnotations()
  
  checkboxIsChecked = ->
    return $('#toggleAnnotationsCheckBox').is(':checked')

  showAnnotations = ->
    $('.annotationTextDiv').show()
  
  hideAnnotations = ->
    $('.annotationTextDiv').hide()

  imageAnnotationGadget.showAnnotationsButton = ->
    $("#toggleAnnotationsLabel").css('display', 'inline-block')
  createToggleButton()
  hideOrShowAnnotationsOnClick()
)

