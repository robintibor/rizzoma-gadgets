jQuery(document).ready(($) ->
  loadAndStoreImageOnButtonClick = ->
    $('#loadImageButton').click(loadAndStoreImageFromUrlText)
  
  loadAndStoreImageFromUrlText = ->
    urlText = $('#imageUrlText').val()
    storeImageSourceInWave(urlText)
    loadImage(urlText)
  
  storeImageSourceInWave = (imageSource) ->
    wave.getState().submitValue("imageSource", imageSource)

  loadImage = (imageSource, callback) ->
    removeURLTextAndButton()
    setDefaultMaxImageWidth()
    setImageSource(imageSource)
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback)
  
  removeURLTextAndButton = ->
    $('#imageUrlText, #loadImageButton').remove()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  setDefaultMaxImageWidth = ->
    if (imageHasNoSizeSet())
      $('#imageToAnnotate').css('max-width', '600px')
  
  imageHasNoSizeSet = ->
    return jQuery('#imageToAnnotate').width() == 0
  
  whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = (callback) ->
    $('#imageToAnnotate').load(() ->
      window.adjustGadgetHeightForImage()
      makeImageAnnotatable()
      removeMaxWidthFromImage()
      callback() if callback?
    )
  
  window.adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight + 10) # + 10 for making scrollbar visible
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    anno.makeAnnotatable(image)
    setAnnotationCanvasSizesToImageSize() # have to do this for some reason :(((
  
  setAnnotationCanvasSizesToImageSize = ->
    imageWidth = $('#imageToAnnotate').width()
    for annotationCanvas in $('canvas.annotorious-opacity-fade')
      $(annotationCanvas).width(imageWidth)
      annotationCanvas.width = imageWidth
  
  removeMaxWidthFromImage = ->
    # make it possible to resize image beyond max 600 px width as well :))
    $('#imageToAnnotate').css('max-width', '')
  
  window.loadImageFromWave = (callback) ->
    if (not window.imageLoaded())
      if (imageSourceStoredInWave())
        imageSource = getImageSourceFromWave()      
        loadImage(imageSource, callback)
      # no callback if no image possible to load ..hmhm.. because then no annotations
      # should be loaded :)
    else
      callback() if callback?
  
  window.imageLoaded = ->
    return $('#imageToAnnotate').attr('src')?
  
  imageSourceStoredInWave = ->
    return wave.getState().get("imageSource")?
  
  getImageSourceFromWave = ->
    return wave.getState().get("imageSource")
  
  loadAndStoreImageOnButtonClick()
)
