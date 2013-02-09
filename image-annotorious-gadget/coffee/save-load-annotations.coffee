jQuery(document).ready(($) ->

  # called from load-image.js atm
  window.loadAnnotationsFromState = ->
    annotations = getAnnotationsFromState()
    if (annotations? and annotableImageExists())
      addOrRemoveAnnotationsInPicture(annotations)
  
  getAnnotationsFromState = ->
    annotationsString = wave.getState().get("annotations")
    annotations = JSON.parse(annotationsString)
    return annotations

  annotableImageExists = ->
    return $('.annotorious-annotationlayer').length > 0
  
  addOrRemoveAnnotationsInPicture = (annotationsFromWave) ->
    removeMissingAnnotations(annotationsFromWave)
    addNewAnnotations(annotationsFromWave)
  
  addNewAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    existingAnnotationStrings = (JSON.stringify(annotation) for annotation in existingAnnotations)
    for annotation in annotationsFromWave
      if JSON.stringify(annotation) not in existingAnnotationStrings
        anno.addAnnotation(annotation)
        createTextDivBelowAnnotation(annotation)
    
  removeMissingAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    annotationWaveStrings = (JSON.stringify(annotation) for annotation in annotationsFromWave)
    for annotation in existingAnnotations
      # ignore undefined annotation :)
      if annotation? and JSON.stringify(annotation) not in annotationWaveStrings
        anno.removeAnnotation(annotation)
        removeAnnotationTextDiv(annotation)
  
  saveAnnotationsOnChange = ->
    anno.addHandler('onAnnotationCreated', syncAnnotationsWithWave)
    anno.addHandler('onAnnotationRemoved', removeAnnotationFromWave)
  
  syncAnnotationsWithWave = (annotation) ->
    annotations = getExistingAnnotations()
    saveAnnotationsToWave(annotations)
  
  getExistingAnnotations = ->
    existingAnnotations = anno.getAnnotations()
    # remove one undefined annotation which is for some reason always
    # at the end of these annotations :)
    cleanExistingAnnotations = (annotation for annotation in existingAnnotations when annotation?)
    return cleanExistingAnnotations
  
  saveAnnotationsToWave = (annotations) ->
    annotationsString = JSON.stringify(annotations)
    wave.getState().submitValue("annotations", annotationsString)
    
  removeAnnotationFromWave = (annotationToRemove) ->
    console.log("removed annotation wave")
    annotations = getAnnotationsFromState()
    annotationsWithoutRemovedOne = annotations.filter((oldAnnotation) ->
      JSON.stringify(oldAnnotation) != JSON.stringify(annotationToRemove))
    saveAnnotationsToWave(annotationsWithoutRemovedOne)
  
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
    console.log("removed annotation text")
    textDiv = getTextDivOfAnnotation(annotation)
    textDiv.remove()
  
  getTextDivOfAnnotation = (annotation) ->
    textDivs = $('.annotationTextDiv')
    positionOfTextDiv = getAnnotationTextPosition(annotation)
    # corresponding text div is found by correct position and 
    # by text of annotation
    for textDiv in textDivs
      textDiv = $(textDiv)
      console.log("textDivPosition #{JSON.stringify(textDiv.position())}")
      console.log("positionOfTextDiv #{JSON.stringify(positionOfTextDiv)}")
      if (textDiv.position().top == Math.round(positionOfTextDiv.top) and 
      textDiv.position().left == Math.round(positionOfTextDiv.left))
        return $(textDiv)
  
  saveAnnotationsOnChange()
  createPermanentTextBelowAnnotationOnCreate()
  removeAnnotationTextsOnRemove()
)