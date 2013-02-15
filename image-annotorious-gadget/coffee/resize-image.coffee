# TODO: resize image on change
jQuery(document).ready(($) ->
 makeImageResizableOnLoad = ->
   $('#imageToAnnotate').load(makeImageResizable)
  
  makeImageResizable = ->
    $('#imageToAnnotate').resizable(
      {
        resize: (event, ui) ->
          window.redrawAnnotationsForNewSize(ui.size)
      }
    )
    makeEditorVisibleOnBoundariesOfImage()
 
 window.redrawAnnotationsForNewSize = (size) ->
   resizeAnnotoriousLayers(size)
   redrawAnnotations()
 
 resizeAnnotoriousLayers = (newSize) ->
   annotoriousElementsToResize = $('.annotorious-annotationlayer, 
   canvas.annotorious-opacity-fade')
   setToSize(annotoriousElementsToResize, newSize)
 
 setToSize = (elements, size) ->
   elements.width(size.width)
   elements.height(size.height)
   for element in elements
    if element.width?
      element.width = size.width
    if element.height?
      element.height = size.height
    console.log(element)
 
 redrawAnnotations = ->
   oldAnnotations = anno.getAnnotations()
   removeAnnotationTextDivs()
   for annotation in oldAnnotations
    if annotation? # ignore one undefined annotation
      anno.removeAnnotation(annotation)
      window.addAnnotationWithText(annotation)

  removeAnnotationTextDivs = ->
    $('.annotationTextDiv').remove()

  makeEditorVisibleOnBoundariesOfImage = ->
    $('.ui-wrapper').css('overflow', '')
 
 makeImageResizableOnLoad()
)