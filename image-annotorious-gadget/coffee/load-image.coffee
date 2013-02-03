jQuery(document).ready(($) ->
  loadAndStoreImageOnButtonClick = ->
    $('#loadImageButton').click(loadAndStoreImageFromUrlText)
  
  loadAndStoreImageFromUrlText = ->
    urlText = $('#imageUrlText').val()
    storeImageSourceInWave(urlText)
    loadImage(urlText)
    #TODO: removeURLButton()
  
  storeImageSourceInWave = (imageSource) ->
    wave.getState().submitValue("imageSource", imageSource)

  loadImage = (imageSource) ->
    console.log("loading image")
    setImageSource(imageSource)
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = ->
    $('#imageToAnnotate').load(() ->
      adjustGadgetHeightForImage()
      makeImageAnnotatable()
      loadAnnotationsFromState()
    )
  
  adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight)
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    console.log("making annotatable!")
    anno.makeAnnotatable(image)
  
  loadImageAndAnnotationsOnStateChange = ->
    wave.setStateCallback(loadImageAndAnnotationsFromState)

  loadImageAndAnnotationsFromState = ->
    if (not imageLoaded())
      loadImageFromState()
    loadAnnotationsFromState()
  
  imageLoaded = ->
    return $('#imageToAnnotate').attr('src')?
  
  loadImageFromState = ->
    imageSource = wave.getState().get("imageSource")
    if (imageSource?)
      loadImage(imageSource)
  
  loadAndStoreImageOnButtonClick()
  loadImageAndAnnotationsOnStateChange()
  
  ### annotation part ###
  # called from load-image.js atm
  loadAnnotationsFromState = ->
    annotations = getAnnotationsFromState()
    if (annotations? and annotableImageExists())
      addAnnotationsToPicture(annotations)
  
  getAnnotationsFromState = ->
    annotationsString = wave.getState().get("annotations")
    annotations = JSON.parse(annotationsString)
    return annotations

  annotableImageExists = ->
    return $('.annotorious-annotationlayer').length > 0
  
  addAnnotationsToPicture = (annotations) ->
    console.log("adding annotations", annotations)
    existingAnnotations = anno.getAnnotations()
    for annotation in annotations
      if annotation not in existingAnnotations
        anno.addAnnotation(annotation)
    console.log("now annotations", anno.getAnnotations())
  
  saveAnnotationsOnChange = ->
    anno.addHandler('onAnnotationCreated', saveNewAnnotationToWave)
  
  saveNewAnnotationToWave = (annotation) ->
    console.log("saving", annotation)
    annotations = getAnnotationsFromState() || []
    if annotation not in annotations
      annotations.push(annotation)
    saveAnnotationsToWave(annotations)
  
  saveAnnotationsToWave = (annotations) ->
    annotationsString = JSON.stringify(annotations)
    wave.getState().submitValue("annotations", annotationsString)
  
  saveAnnotationsOnChange()
)