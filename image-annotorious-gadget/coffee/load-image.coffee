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
    setImageSource(imageSource)
    whenImageLoadedAdjustGadgetHeight()
    makeImageAnnotatable()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  whenImageLoadedAdjustGadgetHeight = ->
    $('#imageToAnnotate').load(adjustGadgetHeightForImage)
  
  adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight)
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    anno.makeAnnotatable(image)
  
  loadImageOnStateChange = ->
     wave.setStateCallback(loadImageFromState)
  
  loadImageFromState = ->
    imageSource =  wave.getState().get("imageSource")
    loadImage(imageSource)
  
  loadAndStoreImageOnButtonClick()
  loadImageOnStateChange()
)