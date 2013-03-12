imageAnnotationGadget = window.imageAnnotationGadget || {}
window.imageAnnotationGadget = imageAnnotationGadget

jQuery(document).ready(($) ->
  
  imageAnnotationGadget.annotableImageExists = ->
    return $('.annotorious-annotationlayer').length > 0
  
  imageAnnotationGadget.addOrRemoveAnnotationsInPicture = (annotationsFromWave) ->
    removeMissingAnnotations(annotationsFromWave)
    addNewAnnotations(annotationsFromWave)
  
  removeMissingAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    annotationWaveStrings = (JSON.stringify(annotation) for annotation in annotationsFromWave)
    for annotation in existingAnnotations
      # ignore undefined annotation :)
      if annotation? and JSON.stringify(annotation) not in annotationWaveStrings
        removeAnnotationWithText(annotation)
  
  removeAnnotationWithText = (annotation) ->
    anno.removeAnnotation(annotation)
    removeAnnotationTextDiv(annotation)
  
  addNewAnnotations = (annotationsFromWave) ->
    existingAnnotations = anno.getAnnotations()
    existingAnnotationStrings = (JSON.stringify(annotation) for annotation in existingAnnotations)
    for annotation in annotationsFromWave
      if JSON.stringify(annotation) not in existingAnnotationStrings
        imageAnnotationGadget.addAnnotationWithText(annotation)
        
  imageAnnotationGadget.addAnnotationWithText = (annotation) ->
    anno.addAnnotation(annotation)
    createTextDivBelowAnnotation(annotation)
  
  saveAnnotationsOnChange = ->
    anno.addHandler('onAnnotationCreated', saveAnnotationsToWave)
    # have to use set timeout for removing annotations because annotation is removed
    # after this handler is called! :)
    anno.addHandler('onAnnotationRemoved', () ->
      setTimeout(saveAnnotationsToWave, 0)
    )
  
  saveAnnotationsToWave =  ->
    annotations = getExistingAnnotations()
    imageAnnotationGadget.wave.saveAnnotations(annotations)
  
  getExistingAnnotations = ->
    existingAnnotations = anno.getAnnotations()
    # remove one undefined annotation which is for some reason always
    # at the end of these annotations :)
    cleanExistingAnnotations = (annotation for annotation in existingAnnotations when annotation?)
    return cleanExistingAnnotations
  
  saveViewerOfAnnotationOnCreate = ->
    anno.addHandler('onAnnotationCreated', saveViewerOfAnnotation)
  
  saveViewerOfAnnotation = (annotation) ->
    viewer = wave.getViewer()
    annotation.viewer = {
      displayName: viewer.getDisplayName(),
      thumbnailUrl: viewer.getThumbnailUrl()
    }
    
  createPermanentTextBelowAnnotationOnCreate = ->
    anno.addHandler('onAnnotationCreated', createOrUpdateTextDivBelowAnnotation)

  createOrUpdateTextDivBelowAnnotation = (annotation) ->
    # 2 Cases: called from save or called from edit...
    # so we have to check if text div already exists :(
    # edit somehow does not trigger onAnnotationRemoved, only onAnnotationCreated :(
    annotationTextDiv = getTextDivOfAnnotation(annotation)
    if (annotationTextDiv?)
      updateAnnotationTextDiv(annotationTextDiv, annotation)
    else
      createTextDivBelowAnnotation(annotation)

  updateAnnotationTextDiv = (textDiv, annotation) ->
    textDiv.find('.annotationText').text(annotation.text)

  createTextDivBelowAnnotation = (annotation) ->
      textDiv = $("<div class='annotationTextDiv'>
          <div class='annotationText'>#{annotation.text}</div>
        </div>")
      avatar = getAnnotationAvatar(annotation)
      addAvatarToTextDiv(textDiv, avatar)
      textDiv.insertBefore('.annotorious-editor')
      styleAnnotationTextDiv(textDiv, annotation)
  
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
  
  getAnnotationAvatar = (annotation) ->
    return annotation.viewer || {
      thumbnailUrl: 'https://rizzoma.com/s/img/user/unknown.png',
      displayName: 'Unknown Person'
    }

  addAvatarToTextDiv = (textDiv, avatar) ->
    textDiv.append("<img src='#{avatar.thumbnailUrl}' class='annotationCreatorAvatar' title='#{avatar.displayName}' alt='#{avatar.displayName}'></img>")
  
  styleAnnotationTextDiv = (textDiv, annotation) ->
    position = getAnnotationTextPosition(annotation)
    setPositionOfTextDiv(textDiv, position)
    imageWidth = getImageWidth()
    setFontSizeOfTextDiv(textDiv, imageWidth)
    setTextWidthOfTextDiv(textDiv, imageWidth)
  
  getImageWidth = ->
    return $('#imageToAnnotate').width()
  
  setPositionOfTextDiv = (textDiv, position) ->
    textDiv.css('position', 'absolute')
    textDiv.css('top', position.top)
    textDiv.css('left', position.left)
    
  setFontSizeOfTextDiv = (textDiv, imageWidth) ->
    fontSize = calculateFontSizeForImageWidth(imageWidth)
    textDiv.find('.annotationText').css('font-size', fontSize)
  
  setTextWidthOfTextDiv = (textDiv) ->
    avatarWidth = textDiv.find('.annotationCreatorAvatar').width()
    # necessary to make outer text div wider for gap between avatar and text! :)(?)
    textDiv.width(textDiv.width() + 7)
    textWidth = textDiv.width() - avatarWidth - 7
    textDiv.find('.annotationText').width(textWidth)
  
  calculateFontSizeForImageWidth = (imageWidth)->
    minimumSize = 9
    maximumSize = 14
    minimumImageWidth = 350
    adjustedSize = minimumSize + ((imageWidth- minimumImageWidth) / 100)
    return Math.min(adjustedSize, maximumSize)
  
  removeAnnotationTextsOnRemove = ->
    anno.addHandler('onAnnotationRemoved', removeAnnotationTextDiv)
  
  removeAnnotationTextDiv = (annotation) ->
    textDiv = getTextDivOfAnnotation(annotation)
    textDiv.remove()
  
  getTextDivOfAnnotation = (annotation) ->
    textDivs = $('.annotationTextDiv')
    positionOfTextDiv = getAnnotationTextPosition(annotation)
    # corresponding text div is found by correct position and 
    # by text of annotation
    for textDiv in textDivs
      textDiv = $(textDiv)
      if (textDiv.position().top == Math.round(positionOfTextDiv.top) and 
      textDiv.position().left == Math.round(positionOfTextDiv.left))
        return $(textDiv)
  
  saveViewerOfAnnotationOnCreate()
  createPermanentTextBelowAnnotationOnCreate()
  removeAnnotationTextsOnRemove()
  saveAnnotationsOnChange()
)