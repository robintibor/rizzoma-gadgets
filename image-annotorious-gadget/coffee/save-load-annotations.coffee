jQuery(document).ready(($) ->

  ### annotation part ###
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
    addNewAnnotations(annotationsFromWave)
    removeMissingAnnotations(annotationsFromWave)
  
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
    anno.addHandler('onAnnotationCreated', saveNewAnnotationToWave)
    anno.addHandler('onAnnotationRemoved', removeAnnotationFromWave)
  
  saveNewAnnotationToWave = (annotation) ->
    console.log("add annotation!")
    annotations = getAnnotationsFromState() || []
    if annotation not in annotations
      annotations.push(annotation)
    saveAnnotationsToWave(annotations)
  
  saveAnnotationsToWave = (annotations) ->
    annotationsString = JSON.stringify(annotations)
    wave.getState().submitValue("annotations", annotationsString)
    
  removeAnnotationFromWave = (annotationToRemove) ->
    console.log("removing annotation!")
    annotations = getAnnotationsFromState()
    annotationsWithoutRemovedOne = annotations.filter((oldAnnotation) ->
      JSON.stringify(oldAnnotation) != JSON.stringify(annotationToRemove))
    saveAnnotationsToWave(annotationsWithoutRemovedOne)
  
  saveAnnotationsOnChange()
)