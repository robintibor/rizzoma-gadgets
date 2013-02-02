#
# * init_gadget.js
# *
# * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
# * Originally Feb 2010 Eyal Zach (eyalzh@gmail.com) for everybodywave.net
# * modified for rizzoma.com by Robin Tibor Schirrmeister (robintibor@gmail.com)
# 

Settings =  
  {
    alwaysShowAnnotations: false
  }
  
GadMode =
  {
    INIT: 0
    EDIT: 1
    VIEW: 3
    ANNOTATION: 4
  }
  
curMode = GadMode.INIT

theImg = null
imgHeight = 0
annotateModel = null
annotateView = null
curAnnot = null
beforeResizeWidth = 0
beforeResizeHeight = 0
annotationDone = false
lastHeightSet = 0

init = ->
  if (wave.isInWaveContainer())
    setWaveEventHandlers()
    setUIEventHandlers()

setWaveEventHandlers = ->
  wave.setStateCallback(loadImageAndAnnotations)
  wave.setModeCallback(setMode)

setUIEventHandlers = ->
  $("#load").click ->
    loadImageByEnteredURL(false)
  $("#isannalways").click onAnnotationsSettingsChange
  $("#eimg").dblclick(onDblClick).hover(onHoverInImg, onHoverOutImg)
  $("#annotext").focus( ->
    $(this).attr("init", "0").val("").css "font-style", "normal"  if $(this).attr("init") is "1")
  $("#submitAnnotationButton").click(onOkAnnot);
  $("#cancelAnnotationButton").click(onCancelAnnot);

loadImageAndAnnotations = ->
  if (imageHasBeenStored())
    loadImageFromState()
  #loadAnnotationsFromState()

imageHasBeenStored = ->
  state = wave.getState()
  imageSource = state.get("imgUrl")
  return imageSource?

loadImageFromState = ->
  console.log("in loadingImageFrom State :)")
  [imageSrc, imageWidth, imageHeight] = getImageDataFromWave()
  loadImage(imageSrc, imageWidth, imageHeight)

getImageDataFromWave = ->
  state = wave.getState()
  imageSrc = state.get("imgUrl")
  imageWidth = state.get("imgWidth")
  imageHeight = state.get("imgHeight")
  console.log("imageWidth", imageWidth);
  console.log("imageHeight", imageHeight);
  return [imageSrc, imageWidth, imageHeight]
 
loadImage = (imageSource, imageWidth, imageHeight) ->
  enterImageSourceInTextBox(imageSource)
  if(imageSource.length > 0)
    showLoadItems()
    createAndShowImage(imageSource, imageWidth, imageHeight)

showLoadItems = ->
  $("#loadlbl").show()  if curMode is GadMode.EDIT
  $("#loader").show()

createAndShowImage = (imageSource, imageWidth, imageHeight) ->
  theImg = new Image()
  theImg.src = imageSource
  theImg.onload = () ->
    showImage(imageWidth, imageHeight)

showImage = (imageWidth, imageHeight) ->
  hideLoadItems()
  setImageSourceAndShowIt()
  setImageSize(imageWidth, imageHeight)
  makeImageResizable()  if curMode is GadMode.EDIT

setImageSourceAndShowIt = ->
  $("#imgo").attr("src", theImg.src)
  #annotateModel.loadFromWave();
  $("#eimg").show()
  $("#imgo").fadeIn(300)

hideLoadItems = ->
  $("#loader").hide()
  $("#loadlbl").hide()

setImageSize = (imageWidth, imageHeight) ->
  console.log("setting image size to", imageWidth, imageHeight)
  $("#imgo").resizable("destroy")  if curMode is GadMode.EDIT
  $("#imgo").css("width", imageWidth)  if imageWidth
  if imageHeight
    imgHeight = imageHeight
    $("#imgo").css("height", imageHeight)
    $("#viewNote").css("top", (imgHeight - 22) + "px")
    console.log("have set image size to", imageWidth, imageHeight)
    fixHeight()

makeImageResizable = ->
  $("#imgo").resizable(  
    {
      resize: (event, ui) ->
        if ui.size.height > lastHeightSet - 60
          lastHeightSet += 20
          gadgets.window.adjustHeight(lastHeightSet)
      start: onResizeStart
      stop: onResizeEnd
      aspectRatio: true
      minHeight: 20
    }
  )

fixHeight = ->
  if (curMode == GadMode.EDIT)
    lastHeightSet = Math.max(parseInt(imgHeight) + 60, 120)
  else
    lastHeightSet = parseInt(imgHeight)
  gadgets.window.adjustHeight(lastHeightSet)

enterImageSourceInTextBox = (imageSource) ->
  $("#imgurl").val(imageSource)  if imageSource?

loadAnnotationsFromState = ->
  state = wave.getState()
  annotateModel = annotateModel or new AnnotateModel()
  annotateView = annotateView or new AnnotateView("#eimg")
  annotateView.reset()
  annotateModel.loadFromWave()
  annControl = undefined
  annotateModel.iterate (annot) ->
    annControl = annotateView.draw(annot)
    $(annControl).dblclick onEditAnnotation

  setIsAnnAlways = state.get("set:iaa")
  if setIsAnnAlways is "1"
    Settings.alwaysShowAnnotations = true
    $("#isannalways").attr "checked", true
    annotateView.showall()  unless curMode is GadMode.EDIT
  else
    if Settings.alwaysShowAnnotations
      annotateView.hideall()
      Settings.alwaysShowAnnotations = false
      $("#isannalways").attr "checked", false
  if annotationDone and curMode is GadMode.ANNOTATION
    switchMode GadMode.VIEW
    annotationDone = false
    annotateView.showall()
  annotateView.showall true  if wave.getMode() is wave.Mode.PLAYBACK

setMode = ->
  mode = wave.getMode()
  if (mode is wave.Mode.EDIT)
    switchMode(GadMode.EDIT)
  else
    switchMode(GadMode.VIEW)

switchMode = (mode) ->
  if (curMode != mode)
    curMode = mode
    switch (mode)
      when (GadMode.EDIT)
        $("#viewNote").hide()
        $("#editNote").show()
        fixHeight()
        $("#edit").slideDown 250
        if $("#imgo").attr("src")
          $("#eimg").addClass "softb"
          makeImageResizable()
        annotateView and annotateView.hideall() and annotateView.cancelEditControl()
        return
      when (GadMode.VIEW)
        $("#imgo").resizable "destroy"
        $("#edit").slideUp 250, ->
          fixHeight()

        $("#imgurl").val (if theImg then theImg.src else "")
        $("#eimg").removeClass "softb"
        $("#annotform").hide()
        $("#imgo").removeClass "dimimg"
        annotateView and Settings.alwaysShowAnnotations and annotateView.showall()
        $("#editNote").hide()
        return
      when (GadMode.ANNOTATION)
        $("#imgo").addClass "dimimg"
        gadgets.window.adjustHeight parseInt(imgHeight) + 53
        $("#viewNote").hide()
        return
        
loadImageByEnteredURL = (fromState) ->
  newImgSrc = $.trim($("#imgurl").val())
  imageIsNew = not theImg or newImgSrc isnt theImg.src
  if newImgSrc.length > 0 and imageIsNew
    $("#loadlbl").show()  if curMode is GadMode.EDIT
    $("#imgo").hide()  if theImg
    $("#eimg").hide()
    $("#loader").show()
    theImg = new Image()
    theImg.src = newImgSrc
    theImg.onload = ->
      onImgLoad fromState
    annotateModel.reset()

onImgLoad = (fromState) ->
  $("#loader").hide()
  $("#imgo").attr "src", theImg.src
  console.log "$", $
  console.log "setting attribute of", $("#imgo")
  unless fromState
    setImageSize theImg.width, theImg.height
    delta =
      imgUrl: theImg.src
      imgWidth: theImg.width
      imgHeight: theImg.height

    delta["set:iaa"] = "1"  if $("#isannalways").attr("checked")
    wave.getState().reset()
    wave.getState().submitDelta delta
  else
    annotateModel.loadFromWave()
  $("#loadlbl").hide()
  $("#eimg").show()
  $("#imgo").fadeIn 300
  
onAnnotationsSettingsChange = ->
  state = wave.getState()
  state and state.submitValue("set:iaa", (if $("#isannalways").attr("checked") then "1" else "0"))
  
onDblClick = (e) ->
  if annotateView and curMode isnt GadMode.EDIT and not e.isPropagationStopped()
    switchMode GadMode.ANNOTATION
    annotateView.cancelEditControl()
    curAnnot = annotateModel.create()
    curAnnot.x = parseInt(e.clientX) - 10
    curAnnot.y = parseInt(e.clientY) - 10
    annotateView.addEditControl curAnnot
    $("#annotform").show().find("#annotext").val("Enter annotation text").attr("init", "1").css "font-style", "italic"
    $("#removebtn").hide()
    
onHoverInImg = ->
  if curMode is GadMode.VIEW
    $("#viewNote").fadeIn()
    annotateView.showall()
  else $("#editNote").fadeIn()  if curMode is GadMode.EDIT
  
onHoverOutImg = ->
  if curMode is GadMode.VIEW
    $("#viewNote").fadeOut()
  else $("#editNote").fadeOut()  if curMode is GadMode.EDIT
  annotateView.hideall()  if not Settings.alwaysShowAnnotations and curMode is GadMode.VIEW

onResizeStart = ->
  beforeResizeWidth = parseInt($(this).css("width"))
  beforeResizeHeight = parseInt($(this).css("height"))
  $("#editNote").hide()
  
onResizeEnd = ->
  imgWidth = $("#imgo").attr("width")
  imgHeight = $("#imgo").attr("height")
  resizeWFactor = (if beforeResizeWidth > 0 then (parseInt(imgWidth) / beforeResizeWidth) else 0)
  resizeHFactor = (if beforeResizeHeight > 0 then (parseInt(imgHeight) / beforeResizeHeight) else 0)
  annotateModel.reposition resizeWFactor, resizeHFactor
  annotateModel.syncWithWave()
  delta =
    imgWidth: imgWidth
    imgHeight: imgHeight

  wave.getState().submitDelta delta
  $("#editNote").show()
  switchMode(GadMode.VIEW)
  
onOkAnnot = ->
  curAnnot.caption = (if $("#annotext").attr("init") isnt "1" then $("#annotext").val().trim() else "")
  curAnnot.creatorName = curAnnot.creatorName or wave.getViewer().getDisplayName()
  annControl = annotateView.finalizeEdit(curAnnot)
  if annotateModel.isChanged(curAnnot)
    annotationDone = true
    annotateModel.save curAnnot
    annotateModel.syncWithWave()
  else
    switchMode GadMode.VIEW
    $(annControl).dblclick onEditAnnotation

onCancelAnnot = ->
  annotateView.cancelEditControl()
  switchMode GadMode.VIEW

onRemoveAnnot = ->
  annotateView.cancelEditControl()
  annotationDone = true
  annotateModel.remove curAnnot

onEditAnnotation = (e) ->
  e.stopPropagation()
  if curMode is GadMode.VIEW
    switchMode GadMode.ANNOTATION
    annKey = $(e.target).attr("aid")
    curAnnot = annotateModel.getAnnotationByKey(annKey)
    annotateView.addEditControl curAnnot
    $("#removebtn").show()
    $("#annotext").val curAnnot.caption

gadgets.util.registerOnLoadHandler(init)