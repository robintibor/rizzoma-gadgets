jQuery(document).ready(($) ->
  # called from load-image.js atm
  window.loadAnnotationsFromState = ->
    annotationsString = wave.getState().get("annotations")
    annotations = JSON.parse(annotationsString)
    addAnnotationsToPicture(annotations)
  
  addAnnotationsToPicture = (annotations) ->
    console.log("adding annotations", annotations)
    for annotation in annotations
      anno.addAnnotation(annotation)
    console.log("now annotations", anno.getAnnotations())
  
  saveAnnotationsOnChange = ->
    anno.addHandler('onAnnotationCreated', saveAnnotationsToWave)
  
  saveAnnotationsToWave = ->
    annotations = anno.getAnnotations()
    annotationsWithoutNull = (annotation for annotation in annotations when annotation?)
    console.log("saving annotations", annotationsWithoutNull)
    annotationsString = JSON.stringify(annotationsWithoutNull)
    wave.getState().submitValue("annotations", annotationsString)
  
  saveAnnotationsOnChange()
)