imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget

jQuery(document).ready(($) ->
  loadAndStoreImageOnButtonClick = ->
    $('#loadImageButton').click(loadAndStoreImageFromUrlText)
  
  loadAndStoreImageFromUrlText = ->
    urlText = $('#imageUrlText').val()
    if (urlHasText(urlText))
      loadAndStoreImage(urlText)
    else 
      displayWarningToUser("Textbox empty! :( Please enter an URL, then click <b>Load Image</b> :)")
  
  urlHasText = (urlText) ->
    return urlText != ""
  
  loadAndStoreImage = (imageSource) ->
    imageAnnotationGadget.wave.storeImageSource(imageSource)
    imageAnnotationGadget.loadImage(imageSource)
  
  # also used by sync-with-wave.coffee
  imageAnnotationGadget.loadImage = (imageSource, callback) ->
    removeLoadMenu()
    setDefaultMaxImageWidth()
    setImageSource(imageSource)
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback)
  
  removeLoadMenu = ->
    $('#loadImageMenu').remove()
    
  setImageSource = (imageSource) ->
    $('#imageToAnnotate').attr('src', imageSource)
  
  setDefaultMaxImageWidth = ->
    if (imageHasNoSizeSet())
      $('#imageToAnnotate').css('max-width', '600px')
  
  imageHasNoSizeSet = ->
    return jQuery('#imageToAnnotate').width() == 0
  
  whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = (callback) ->
    $('#imageToAnnotate').load(() ->
      imageAnnotationGadget.adjustGadgetHeightForImage()
      retainCurrentSizeAndRemoveMaxWidthFromImage()
      makeImageAnnotatable()
      imageAnnotationGadget.showAnnotationsButton()
      callback() if callback?
    )
  
  imageAnnotationGadget.adjustGadgetHeightForImage = ->
    bodyHeight = $('body').height()
    gadgets.window.adjustHeight(bodyHeight + 10) # + 10 for making scrollbar visible
  
  makeImageAnnotatable = ->
    image = $('#imageToAnnotate')[0]
    anno.makeAnnotatable(image)
    setAnnotationCanvasSizesToImageSize() # have to do this for some reason :(((
  
  setAnnotationCanvasSizesToImageSize = ->
    imageWidth = $('#imageToAnnotate').width()
    imageHeight = $('#imageToAnnotate').height()
    for annotationCanvas in $('canvas.annotorious-opacity-fade')
      $(annotationCanvas).width(imageWidth)
      annotationCanvas.width = imageWidth
      $(annotationCanvas).height(imageHeight)
      annotationCanvas.height = imageHeight
  
  retainCurrentSizeAndRemoveMaxWidthFromImage = ->
    # make it possible to resize image beyond max 600 px width as well :))
    currentImageWidth = $('#imageToAnnotate').width()
    currentImageHeight = $('#imageToAnnotate').height()
    $('#imageToAnnotate').width(currentImageWidth)
    $('#imageToAnnotate').height(currentImageHeight)
    $('#imageToAnnotate').css('max-width', '')
  
  imageAnnotationGadget.imageLoaded = ->
    return $('#imageToAnnotate').attr('src')?
  
  loadImageOnPaste = ->
    $('#imageUrlText').on('paste', loadImageFromPastedData)
  
  loadImageFromPastedData = (event) ->
    loadImageIfImagePasted(event)
  
  loadImageIfImagePasted = (event) ->
    clipboardData = event.clipboardData  || event.originalEvent.clipboardData
    items = clipboardData.items
    for item in items
      itemIsImage = item.type.indexOf("image") != -1
      if (itemIsImage)
        loadImageFromImageFile(item)
        return

  loadImageFromImageFile = (item) ->
    imageFile = item.getAsFile()
    imageReader = new FileReader();
    imageReader.onload = (event) ->
      base64ImageSource = event.target.result
      if (imageSourceIsSmallEnough(base64ImageSource))
        loadAndStoreImage(base64ImageSource)
      else
        showSizeWarningToUser()
    imageReader.readAsDataURL(imageFile)
  
  imageSourceIsSmallEnough = (imageSource) ->
    sourceInKiloBytes = imageSource.length / 1024
    return sourceInKiloBytes < 500
  
  showSizeWarningToUser = ->
    displayWarningToUser('Image too big for pasting directly, paste image into rizzoma and copy URL instead :)')

  displayWarningToUser = (warningText) ->
    jQuery('#imageTooBigText').html(warningText)

  loadAndStoreImageOnButtonClick()
  loadImageOnPaste()
)
