imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget

jQuery(document).ready(($) ->

  imageAnnotationGadget.setImageSizeAndRedrawAnnotations = (newImageSize) ->
    if (imageSizeHasChanged(newImageSize))
      imageAnnotationGadget.setImageSize(newImageSize)
      redrawAnnotationsForNewSize(newImageSize)
  
  imageSizeHasChanged = (newImageSize) ->
    image = $('#imageToAnnotate')
    return image.width() != newImageSize.width or image.height() != newImageSize.height
  
  imageAnnotationGadget.setImageSize = (imageSize) ->
    imageAndResizableWrapper = $('#imageToAnnotate, .ui-wrapper')
    setElementsToSize(imageAndResizableWrapper, imageSize)
    imageAnnotationGadget.adjustGadgetHeightForImage()
  
  makeImageResizableOnLoad = ->
    $('#imageToAnnotate').load(makeImageResizable)
  
  makeImageResizable = ->
    $('#imageToAnnotate').resizable(
      {
        aspectRatio: true,
        resize: (event, ui) ->
          imageAnnotationGadget.adjustGadgetHeightForImage()
          redrawAnnotationsForNewSize(ui.size)
        stop: (event, ui) ->
          imageAnnotationGadget.wave.saveNewImageSize(ui.size)
      }
    )
    makeEditorVisibleOnBoundariesOfImage()
 
  redrawAnnotationsForNewSize = (size) ->
    resizeAnnotoriousLayers(size)
    redrawAnnotations()
 
  resizeAnnotoriousLayers = (newSize) ->
    annotoriousElementsToResize = $('.annotorious-annotationlayer, 
    canvas.annotorious-opacity-fade')
    setElementsToSize(annotoriousElementsToResize, newSize)
 
  setElementsToSize = (elements, size) ->
    # set css properties with jquery
    elements.width(size.width)
    elements.height(size.height)
    # also set width/ height html-properties, they might override css properties
    for element in elements
      if element.width?
        element.width = size.width
      if element.height?
        element.height = size.height
 
  redrawAnnotations = ->
    oldAnnotations = anno.getAnnotations()
    removeAnnotationTextDivs()
    for annotation in oldAnnotations
      if annotation? # ignore one undefined annotation
        anno.removeAnnotation(annotation)
        imageAnnotationGadget.addAnnotationWithText(annotation)

  removeAnnotationTextDivs = ->
    $('.annotationTextDiv').remove()

  setNewScrollPositionAfterResize = (ui) ->
    widthDifference = ui.size.width - ui.originalSize.width
    $('#imageDiv').scrollLeft(scrollBeforeResize + widthDifference)

  makeEditorVisibleOnBoundariesOfImage = ->
    $('.ui-wrapper').css('overflow', '')
 
  makeImageResizableOnLoad()
)