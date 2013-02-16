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
    setImageSource(imageSource)
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback)
  
  removeURLTextAndButton = ->
    $('#imageUrlText, #loadImageButton').remove()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = (callback) ->
    $('#imageToAnnotate').load(() ->
      adjustGadgetHeightForImage()
      makeImageAnnotatable()
      callback() if callback?
    )
  
  adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight + 6) # + 6 for making scrollbar visible
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    anno.makeAnnotatable(image)
  
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
