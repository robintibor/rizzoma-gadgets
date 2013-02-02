(function() {
  var GadMode, Settings, annotateModel, annotateView, annotationDone, beforeResizeHeight, beforeResizeWidth, createAndShowImage, curAnnot, curMode, enterImageSourceInTextBox, fixHeight, getImageDataFromWave, hideLoadItems, imageHasBeenStored, imgHeight, init, lastHeightSet, loadAnnotationsFromState, loadImage, loadImageAndAnnotations, loadImageByEnteredURL, loadImageFromState, makeImageResizable, onAnnotationsSettingsChange, onCancelAnnot, onDblClick, onEditAnnotation, onHoverInImg, onHoverOutImg, onImgLoad, onOkAnnot, onRemoveAnnot, onResizeEnd, onResizeStart, setImageSize, setImageSourceAndShowIt, setMode, setUIEventHandlers, setWaveEventHandlers, showImage, showLoadItems, switchMode, theImg;

  Settings = {
    alwaysShowAnnotations: false
  };

  GadMode = {
    INIT: 0,
    EDIT: 1,
    VIEW: 3,
    ANNOTATION: 4
  };

  curMode = GadMode.INIT;

  theImg = null;

  imgHeight = 0;

  annotateModel = null;

  annotateView = null;

  curAnnot = null;

  beforeResizeWidth = 0;

  beforeResizeHeight = 0;

  annotationDone = false;

  lastHeightSet = 0;

  init = function() {
    if (wave.isInWaveContainer()) {
      setWaveEventHandlers();
      return setUIEventHandlers();
    }
  };

  setWaveEventHandlers = function() {
    wave.setStateCallback(loadImageAndAnnotations);
    return wave.setModeCallback(setMode);
  };

  setUIEventHandlers = function() {
    $("#load").click(function() {
      return loadImageByEnteredURL(false);
    });
    $("#isannalways").click(onAnnotationsSettingsChange);
    $("#eimg").dblclick(onDblClick).hover(onHoverInImg, onHoverOutImg);
    $("#annotext").focus(function() {
      if ($(this).attr("init") === "1") {
        return $(this).attr("init", "0").val("").css("font-style", "normal");
      }
    });
    $("#submitAnnotationButton").click(onOkAnnot);
    return $("#cancelAnnotationButton").click(onCancelAnnot);
  };

  loadImageAndAnnotations = function() {
    if (imageHasBeenStored()) {
      return loadImageFromState();
    }
  };

  imageHasBeenStored = function() {
    var imageSource, state;
    state = wave.getState();
    imageSource = state.get("imgUrl");
    return imageSource != null;
  };

  loadImageFromState = function() {
    var imageHeight, imageSrc, imageWidth, _ref;
    console.log("in loadingImageFrom State :)");
    _ref = getImageDataFromWave(), imageSrc = _ref[0], imageWidth = _ref[1], imageHeight = _ref[2];
    return loadImage(imageSrc, imageWidth, imageHeight);
  };

  getImageDataFromWave = function() {
    var imageHeight, imageSrc, imageWidth, state;
    state = wave.getState();
    imageSrc = state.get("imgUrl");
    imageWidth = state.get("imgWidth");
    imageHeight = state.get("imgHeight");
    console.log("imageWidth", imageWidth);
    console.log("imageHeight", imageHeight);
    return [imageSrc, imageWidth, imageHeight];
  };

  loadImage = function(imageSource, imageWidth, imageHeight) {
    enterImageSourceInTextBox(imageSource);
    if (imageSource.length > 0) {
      showLoadItems();
      return createAndShowImage(imageSource, imageWidth, imageHeight);
    }
  };

  showLoadItems = function() {
    if (curMode === GadMode.EDIT) {
      $("#loadlbl").show();
    }
    return $("#loader").show();
  };

  createAndShowImage = function(imageSource, imageWidth, imageHeight) {
    theImg = new Image();
    theImg.src = imageSource;
    return theImg.onload = function() {
      return showImage(imageWidth, imageHeight);
    };
  };

  showImage = function(imageWidth, imageHeight) {
    hideLoadItems();
    setImageSourceAndShowIt();
    setImageSize(imageWidth, imageHeight);
    if (curMode === GadMode.EDIT) {
      return makeImageResizable();
    }
  };

  setImageSourceAndShowIt = function() {
    $("#imgo").attr("src", theImg.src);
    $("#eimg").show();
    return $("#imgo").fadeIn(300);
  };

  hideLoadItems = function() {
    $("#loader").hide();
    return $("#loadlbl").hide();
  };

  setImageSize = function(imageWidth, imageHeight) {
    console.log("setting image size to", imageWidth, imageHeight);
    if (curMode === GadMode.EDIT) {
      $("#imgo").resizable("destroy");
    }
    if (imageWidth) {
      $("#imgo").css("width", imageWidth);
    }
    if (imageHeight) {
      imgHeight = imageHeight;
      $("#imgo").css("height", imageHeight);
      $("#viewNote").css("top", (imgHeight - 22) + "px");
      console.log("have set image size to", imageWidth, imageHeight);
      return fixHeight();
    }
  };

  makeImageResizable = function() {
    return $("#imgo").resizable({
      resize: function(event, ui) {
        if (ui.size.height > lastHeightSet - 60) {
          lastHeightSet += 20;
          return gadgets.window.adjustHeight(lastHeightSet);
        }
      },
      start: onResizeStart,
      stop: onResizeEnd,
      aspectRatio: true,
      minHeight: 20
    });
  };

  fixHeight = function() {
    if (curMode === GadMode.EDIT) {
      lastHeightSet = Math.max(parseInt(imgHeight) + 60, 120);
    } else {
      lastHeightSet = parseInt(imgHeight);
    }
    return gadgets.window.adjustHeight(lastHeightSet);
  };

  enterImageSourceInTextBox = function(imageSource) {
    if (imageSource != null) {
      return $("#imgurl").val(imageSource);
    }
  };

  loadAnnotationsFromState = function() {
    var annControl, setIsAnnAlways, state;
    state = wave.getState();
    annotateModel = annotateModel || new AnnotateModel();
    annotateView = annotateView || new AnnotateView("#eimg");
    annotateView.reset();
    annotateModel.loadFromWave();
    annControl = void 0;
    annotateModel.iterate(function(annot) {
      annControl = annotateView.draw(annot);
      return $(annControl).dblclick(onEditAnnotation);
    });
    setIsAnnAlways = state.get("set:iaa");
    if (setIsAnnAlways === "1") {
      Settings.alwaysShowAnnotations = true;
      $("#isannalways").attr("checked", true);
      if (curMode !== GadMode.EDIT) {
        annotateView.showall();
      }
    } else {
      if (Settings.alwaysShowAnnotations) {
        annotateView.hideall();
        Settings.alwaysShowAnnotations = false;
        $("#isannalways").attr("checked", false);
      }
    }
    if (annotationDone && curMode === GadMode.ANNOTATION) {
      switchMode(GadMode.VIEW);
      annotationDone = false;
      annotateView.showall();
    }
    if (wave.getMode() === wave.Mode.PLAYBACK) {
      return annotateView.showall(true);
    }
  };

  setMode = function() {
    var mode;
    mode = wave.getMode();
    if (mode === wave.Mode.EDIT) {
      return switchMode(GadMode.EDIT);
    } else {
      return switchMode(GadMode.VIEW);
    }
  };

  switchMode = function(mode) {
    if (curMode !== mode) {
      curMode = mode;
      switch (mode) {
        case GadMode.EDIT:
          $("#viewNote").hide();
          $("#editNote").show();
          fixHeight();
          $("#edit").slideDown(250);
          if ($("#imgo").attr("src")) {
            $("#eimg").addClass("softb");
            makeImageResizable();
          }
          annotateView && annotateView.hideall() && annotateView.cancelEditControl();
          break;
        case GadMode.VIEW:
          $("#imgo").resizable("destroy");
          $("#edit").slideUp(250, function() {
            return fixHeight();
          });
          $("#imgurl").val((theImg ? theImg.src : ""));
          $("#eimg").removeClass("softb");
          $("#annotform").hide();
          $("#imgo").removeClass("dimimg");
          annotateView && Settings.alwaysShowAnnotations && annotateView.showall();
          $("#editNote").hide();
          break;
        case GadMode.ANNOTATION:
          $("#imgo").addClass("dimimg");
          gadgets.window.adjustHeight(parseInt(imgHeight) + 53);
          $("#viewNote").hide();
      }
    }
  };

  loadImageByEnteredURL = function(fromState) {
    var imageIsNew, newImgSrc;
    newImgSrc = $.trim($("#imgurl").val());
    imageIsNew = !theImg || newImgSrc !== theImg.src;
    if (newImgSrc.length > 0 && imageIsNew) {
      if (curMode === GadMode.EDIT) {
        $("#loadlbl").show();
      }
      if (theImg) {
        $("#imgo").hide();
      }
      $("#eimg").hide();
      $("#loader").show();
      theImg = new Image();
      theImg.src = newImgSrc;
      theImg.onload = function() {
        return onImgLoad(fromState);
      };
      return annotateModel.reset();
    }
  };

  onImgLoad = function(fromState) {
    var delta;
    $("#loader").hide();
    $("#imgo").attr("src", theImg.src);
    console.log("$", $);
    console.log("setting attribute of", $("#imgo"));
    if (!fromState) {
      setImageSize(theImg.width, theImg.height);
      delta = {
        imgUrl: theImg.src,
        imgWidth: theImg.width,
        imgHeight: theImg.height
      };
      if ($("#isannalways").attr("checked")) {
        delta["set:iaa"] = "1";
      }
      wave.getState().reset();
      wave.getState().submitDelta(delta);
    } else {
      annotateModel.loadFromWave();
    }
    $("#loadlbl").hide();
    $("#eimg").show();
    return $("#imgo").fadeIn(300);
  };

  onAnnotationsSettingsChange = function() {
    var state;
    state = wave.getState();
    return state && state.submitValue("set:iaa", ($("#isannalways").attr("checked") ? "1" : "0"));
  };

  onDblClick = function(e) {
    if (annotateView && curMode !== GadMode.EDIT && !e.isPropagationStopped()) {
      switchMode(GadMode.ANNOTATION);
      annotateView.cancelEditControl();
      curAnnot = annotateModel.create();
      curAnnot.x = parseInt(e.clientX) - 10;
      curAnnot.y = parseInt(e.clientY) - 10;
      annotateView.addEditControl(curAnnot);
      $("#annotform").show().find("#annotext").val("Enter annotation text").attr("init", "1").css("font-style", "italic");
      return $("#removebtn").hide();
    }
  };

  onHoverInImg = function() {
    if (curMode === GadMode.VIEW) {
      $("#viewNote").fadeIn();
      return annotateView.showall();
    } else {
      if (curMode === GadMode.EDIT) {
        return $("#editNote").fadeIn();
      }
    }
  };

  onHoverOutImg = function() {
    if (curMode === GadMode.VIEW) {
      $("#viewNote").fadeOut();
    } else {
      if (curMode === GadMode.EDIT) {
        $("#editNote").fadeOut();
      }
    }
    if (!Settings.alwaysShowAnnotations && curMode === GadMode.VIEW) {
      return annotateView.hideall();
    }
  };

  onResizeStart = function() {
    beforeResizeWidth = parseInt($(this).css("width"));
    beforeResizeHeight = parseInt($(this).css("height"));
    return $("#editNote").hide();
  };

  onResizeEnd = function() {
    var delta, imgWidth, resizeHFactor, resizeWFactor;
    imgWidth = $("#imgo").attr("width");
    imgHeight = $("#imgo").attr("height");
    resizeWFactor = (beforeResizeWidth > 0 ? parseInt(imgWidth) / beforeResizeWidth : 0);
    resizeHFactor = (beforeResizeHeight > 0 ? parseInt(imgHeight) / beforeResizeHeight : 0);
    annotateModel.reposition(resizeWFactor, resizeHFactor);
    annotateModel.syncWithWave();
    delta = {
      imgWidth: imgWidth,
      imgHeight: imgHeight
    };
    wave.getState().submitDelta(delta);
    $("#editNote").show();
    return switchMode(GadMode.VIEW);
  };

  onOkAnnot = function() {
    var annControl;
    curAnnot.caption = ($("#annotext").attr("init") !== "1" ? $("#annotext").val().trim() : "");
    curAnnot.creatorName = curAnnot.creatorName || wave.getViewer().getDisplayName();
    annControl = annotateView.finalizeEdit(curAnnot);
    if (annotateModel.isChanged(curAnnot)) {
      annotationDone = true;
      annotateModel.save(curAnnot);
      return annotateModel.syncWithWave();
    } else {
      switchMode(GadMode.VIEW);
      return $(annControl).dblclick(onEditAnnotation);
    }
  };

  onCancelAnnot = function() {
    annotateView.cancelEditControl();
    return switchMode(GadMode.VIEW);
  };

  onRemoveAnnot = function() {
    annotateView.cancelEditControl();
    annotationDone = true;
    return annotateModel.remove(curAnnot);
  };

  onEditAnnotation = function(e) {
    var annKey;
    e.stopPropagation();
    if (curMode === GadMode.VIEW) {
      switchMode(GadMode.ANNOTATION);
      annKey = $(e.target).attr("aid");
      curAnnot = annotateModel.getAnnotationByKey(annKey);
      annotateView.addEditControl(curAnnot);
      $("#removebtn").show();
      return $("#annotext").val(curAnnot.caption);
    }
  };

  gadgets.util.registerOnLoadHandler(init);

}).call(this);
