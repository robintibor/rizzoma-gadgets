jQuery(document).ready(($) ->
  loadAndStoreImageOnButtonClick = ->
    $('#loadImageButton').click(loadAndStoreImageFromUrlText)
  
  loadAndStoreImageFromUrlText = ->
    urlText = $('#imageUrlText').val()
    storeImageSourceInWave(urlText)
    loadImage(urlText)
  
  storeImageSourceInWave = (imageSource) ->
    wave.getState().submitValue("imageSource", imageSource)

  loadImage = (imageSource) ->
    removeURLTextAndButton()
    setImageSource(imageSource)
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = ->
    $('#imageToAnnotate').load(() ->
      adjustGadgetHeightForImage()
      makeImageAnnotatable()
      window.loadAnnotationsFromState() # see save-load-annotations.coffee
    )
  
  adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight + 6) # + 6 for making scrollbar visible
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    anno.makeAnnotatable(image)
  
  removeURLTextAndButton = ->
    $('#imageUrlText, #loadImageButton').remove()
  
  loadImageAndAnnotationsOnStateChange = ->
    wave.setStateCallback(loadImageAndAnnotationsFromState)

  loadImageAndAnnotationsFromState = ->
    if (not imageLoaded())
      loadImageFromState()
    else
      window.loadAnnotationsFromState()
  
  imageLoaded = ->
    return $('#imageToAnnotate').attr('src')?
  
  loadImageFromState = ->
    imageSource = wave.getState().get("imageSource")
    if (imageSource?)
      loadImage(imageSource)
  
  loadAndStoreImageOnButtonClick()
  loadImageAndAnnotationsOnStateChange()
)
