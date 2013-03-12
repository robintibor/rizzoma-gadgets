imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget

jQuery(document).ready(($) ->
  
  imageAnnotationGadget.annotableImageExists = ->
    return $('.annotorious-annotationlayer').length > 0
  
  imageAnnotationGadget.addOrRemoveAnnotationsInPicture = (annotationsFromWave) ->
    removeMissingAnnotations(annotationsFromWave)
    addNewAnnotations(annotationsFromWave)
  
  removeMissingAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    annotationWaveStrings = (JSON.stringify(annotation) for annotation in annotationsFromWave)
    for annotation in existingAnnotations
      # ignore undefined annotation :)
      if annotation? and JSON.stringify(annotation) not in annotationWaveStrings
        removeAnnotationWithText(annotation)
  
  removeAnnotationWithText = (annotation) ->
    anno.removeAnnotation(annotation)
    removeAnnotationTextDiv(annotation)
  
  addNewAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    existingAnnotationStrings = (JSON.stringify(annotation) for annotation in existingAnnotations)
    for annotation in annotationsFromWave
      if JSON.stringify(annotation) not in existingAnnotationStrings
        imageAnnotationGadget.addAnnotationWithText(annotation)
        
  imageAnnotationGadget.addAnnotationWithText = (annotation) ->
    anno.addAnnotation(annotation)
    createTextDivBelowAnnotation(annotation)
  
  saveAnnotationsOnChange = ->
    anno.addHandler('onAnnotationCreated', saveAnnotationsToWave)
    # have to use set timeout for removing annotations because annotation is removed
    # after this handler is called! :)
    anno.addHandler('onAnnotationRemoved', () ->
      setTimeout(saveAnnotationsToWave, 0)
    )
  
  saveAnnotationsToWave =  ->
    annotations = getExistingAnnotations()
    imageAnnotationGadget.wave.saveAnnotations(annotations)
  
  getExistingAnnotations = ->
    existingAnnotations = anno.getAnnotations()
    # remove one undefined annotation which is for some reason always
    # at the end of these annotations :)
    cleanExistingAnnotations = (annotation for annotation in existingAnnotations when annotation?)
    return cleanExistingAnnotations
  
  saveViewerOfAnnotationOnCreate = ->
    anno.addHandler('onAnnotationCreated', saveViewerOfAnnotation)
  
  saveViewerOfAnnotation = (annotation) ->
    viewer = wave.getViewer()
    annotation.viewer = {
      displayName: viewer.getDisplayName(),
      thumbnailUrl: viewer.getThumbnailUrl()
    }
    console.log("added viewer to", annotation)
    
  createPermanentTextBelowAnnotationOnCreate = ->
    anno.addHandler('onAnnotationCreated', createOrUpdateTextDivBelowAnnotation)

  createOrUpdateTextDivBelowAnnotation = (annotation) ->
    # 2 Cases: called from save or called from edit...
    # so we have to check if text div already exists :(
    # edit somehow does not trigger onAnnotationRemoved, only onAnnotationCreated :(
    annotationTextDiv = getTextDivOfAnnotation(annotation)
    if (annotationTextDiv?)
      annotationTextDiv.text(annotation.text)
    else
      createTextDivBelowAnnotation(annotation)
      
  createTextDivBelowAnnotation = (annotation) ->
      position = getAnnotationTextPosition(annotation)
      textDiv = $("<div class='annotationTextDiv'>#{annotation.text}</div>")
      textDiv.css('position', 'absolute')
      textDiv.css('top', position.top)
      textDiv.css('left', position.left)
      textDiv.insertBefore('.annotorious-editor')
    
  
  getAnnotationTextPosition = (annotation) ->
    imageWidth = $('.annotorious-annotationlayer').width()
    imageHeight = $('.annotorious-annotationlayer').height()
    # height of shape of annotation rectangle! text should be below rectangle!
    shapeHeight = annotation.shapes[0].geometry.height * imageHeight
    annotationLeft = annotation.shapes[0].geometry.x * imageWidth
    annotationTop = annotation.shapes[0].geometry.y * imageHeight + shapeHeight
    return {
      top: annotationTop,
      left: annotationLeft
    }
  
  removeAnnotationTextsOnRemove = ->
    anno.addHandler('onAnnotationRemoved', removeAnnotationTextDiv)
  
  removeAnnotationTextDiv = (annotation) ->
    textDiv = getTextDivOfAnnotation(annotation)
    textDiv.remove()
  
  getTextDivOfAnnotation = (annotation) ->
    textDivs = $('.annotationTextDiv')
    positionOfTextDiv = getAnnotationTextPosition(annotation)
    # corresponding text div is found by correct position and 
    # by text of annotation
    for textDiv in textDivs
      textDiv = $(textDiv)
      if (textDiv.position().top == Math.round(positionOfTextDiv.top) and 
      textDiv.position().left == Math.round(positionOfTextDiv.left))
        return $(textDiv)
  
  saveViewerOfAnnotationOnCreate()
  createPermanentTextBelowAnnotationOnCreate()
  removeAnnotationTextsOnRemove()
  saveAnnotationsOnChange()
)