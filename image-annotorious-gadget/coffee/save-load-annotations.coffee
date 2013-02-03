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
    
  removeMissingAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    annotationWaveStrings = (JSON.stringify(annotation) for annotation in annotationsFromWave)
    for annotation in existingAnnotations
      # ignore undefined annotation :)
      if annotation? and JSON.stringify(annotation) not in annotationWaveStrings
        anno.removeAnnotation(annotation)
  
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
    annotations = getAnnotationsFromState()
    annotationsWithoutRemovedOne = annotations.filter((oldAnnotation) ->
      JSON.stringify(oldAnnotation) != JSON.stringify(annotationToRemove))
    saveAnnotationsToWave(annotationsWithoutRemovedOne)
  
  saveAnnotationsOnChange()
)