imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget
imageAnnotationGadget.wave = {}

onWaveStateChange = ->
  # image size first, so that image is not first loaded with wrong size
  loadImageSizeFromWave()
  loadImageFromWave(loadAnnotationsFromWave)

loadImageFromWave = (callback) ->
    if (not imageAnnotationGadget.imageLoaded())
      if (imageSourceStoredInWave())
        imageSource = getImageSourceFromWave()      
        imageAnnotationGadget.loadImage(imageSource, callback)
      # no callback if no image possible to load ..hmhm.. because then no annotations
      # should be loaded :)
    else
      callback() if callback?
  
imageSourceStoredInWave = ->
    return wave.getState().get("imageSource")?
  
getImageSourceFromWave = ->
    return wave.getState().get("imageSource")

# called from connect-to-wave.js atm
loadAnnotationsFromWave = ->
  annotations = imageAnnotationGadget.wave.getAnnotationsFromWave()
  if (annotations? and imageAnnotationGadget.annotableImageExists())
    imageAnnotationGadget.addOrRemoveAnnotationsInPicture(annotations)

imageAnnotationGadget.wave.getAnnotationsFromWave = ->
  annotationsString = wave.getState().get("annotations")
  annotations = JSON.parse(annotationsString)
  return annotations


imageAnnotationGadget.wave.storeImageSource = (imageSource) ->
    wave.getState().submitValue("imageSource", imageSource)

imageAnnotationGadget.wave.saveAnnotations = (annotations) ->
    annotationsString = JSON.stringify(annotations)
    wave.getState().submitValue("annotations", annotationsString)

loadImageSizeFromWave = ->
    imageSizeString = wave.getState().get("imageSize")
    if (imageSizeString?)
      imageSize = JSON.parse(imageSizeString)
      if (imageAnnotationGadget.imageLoaded())
        imageAnnotationGadget.setImageSizeAndRedrawAnnotations(imageSize)
      else  # set image size before load for better UI experience :))
        imageAnnotationGadget.setImageSize(imageSize)

imageAnnotationGadget.wave.saveNewImageSize = (newSize) ->
  wave.getState().submitValue("imageSize", JSON.stringify(newSize))
    
wave.setStateCallback(onWaveStateChange)