# TODO: 
# push branch resize to github!!
# on stop save new size to wave
# on wave state changed
# check if iamge size changed, if yes:
# set image size and ui wrapper size
# call window.redrawAnnotationsForNewSize :)
jQuery(document).ready(($) ->
  window.loadImageSizeFromWave = ->
    imageSizeString = wave.getState().get("imageSize")
    if (imageSizeString?)
      imageSize = JSON.parse(imageSizeString)
      if (window.imageLoaded())
        window.setImageSizeAndRedrawAnnotations(imageSize)
      else  # set image size before load for better UI experience :))
        setImageSize(imageSize)

  window.setImageSizeAndRedrawAnnotations = (newImageSize) ->
    if (imageSizeHasChanged(newImageSize))
      setImageSize(newImageSize)
      window.redrawAnnotationsForNewSize(newImageSize)
  
  imageSizeHasChanged = (newImageSize) ->
    image = $('#imageToAnnotate')
    return image.width() != newImageSize.width or image.height() != newImageSize.height
  
  setImageSize = (imageSize) ->
    imageAndResizableWrapper = $('#imageToAnnotate, .ui-wrapper')
    setElementsToSize(imageAndResizableWrapper, imageSize)
    window.adjustGadgetHeightForImage()
  
  makeImageResizableOnLoad = ->
    $('#imageToAnnotate').load(makeImageResizable)
  
  makeImageResizable = ->
    $('#imageToAnnotate').resizable(
      {
        aspectRatio: true,
        start: rememberScrollBeforeResize,
        resize: (event, ui) ->
          window.adjustGadgetHeightForImage()
          window.redrawAnnotationsForNewSize(ui.size)
          setNewScrollPositionAfterResize(ui)
        stop: (event, ui) ->
          saveNewImageSizeToWave(ui.size)
      }
    )
    makeEditorVisibleOnBoundariesOfImage()
 
  scrollBeforeResize = 0
  rememberScrollBeforeResize = ->
    scrollBeforeResize = $('#imageDiv').scrollLeft()
 
  window.redrawAnnotationsForNewSize = (size) ->
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
        window.addAnnotationWithText(annotation)

  removeAnnotationTextDivs = ->
    $('.annotationTextDiv').remove()

  setNewScrollPositionAfterResize = (ui) ->
    widthDifference = ui.size.width - ui.originalSize.width
    $('#imageDiv').scrollLeft(scrollBeforeResize + widthDifference)

  makeEditorVisibleOnBoundariesOfImage = ->
    $('.ui-wrapper').css('overflow', '')
 
  saveNewImageSizeToWave = (newSize) ->
    wave.getState().submitValue("imageSize", JSON.stringify(newSize))
 
  makeImageResizableOnLoad()
)