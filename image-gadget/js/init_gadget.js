/*
 * init_gadget.js
 *
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Originally Feb 2010 Eyal Zach (eyalzh@gmail.com) for everybodywave.net
 * modified for rizzoma.com by Robin Tibor Schirrmeister (robintibor@gmail.com)
 */
 
Settings = {
   'alwaysShowAnnotations': false
 };
 GadMode = {
   INIT: 0,
   EDIT: 1,
   VIEW: 3,
   ANNOTATION: 4
 };
 var curMode = GadMode.INIT;

 var theImg = null;
 var imgHeight = 0;

 var annotateModel = null;
 var annotateView = null;
 var curAnnot = null;
 var beforeResizeWidth = 0;
 var beforeResizeHeight = 0;
 var annotationDone = false;
 var lastHeightSet = 0;

 function init() {
   if (wave.isInWaveContainer()) {
     setWaveEventHandlers();
     setUIEventHandlers();
   }
 }

function setWaveEventHandlers() {
     wave.setStateCallback(loadImageAndAnnotations);
     wave.setModeCallback(setMode);
}

function setUIEventHandlers() {
     $("#load").click(function () {
       loadImageByEnteredURL(false)
     });
     $("#isannalways").click(onAnnotationsSettingsChange);
     $("#eimg")
       .dblclick(onDblClick)
       .hover(onHoverInImg, onHoverOutImg);
     $("#annotext").focus(function () {
       if ($(this).attr("init") == "1") $(this).attr("init", "0").val("").css("font-style", "normal");
     });
}

function loadImageAndAnnotations() {
    loadImageFromState();
    loadAnnotationsFromState();
 }

function loadImageFromState() {
   var state = wave.getState();
   var imageSrc = state.get("imgUrl");
   var imageWidth = state.get("imgWidth");
   var imageHeight = state.get("imgHeight");
   loadImage(imageSrc, imageWidth, imageHeight);
}

function loadImage(imageSource, imageWidth, imageHeight) {
    enterImageSourceInTextBox(imageSource);
     if (imageSource.length > 0) {
        if (curMode == GadMode.EDIT) {
            $("#loadlbl").show();
        }
        $("#loader").show();
        theImg = new Image();
        theImg.src = imageSource;
        theImg.onload = showImage;
        annotateModel.reset();
        setImageSize(imageWidth, imageHeight);
    }
}

function showImage() {
    $("#loader").hide();

   $("#imgo").attr("src", theImg.src);
   console.log("$", $);
   console.log("setting attribute of", $("#imgo"));
   //annotateModel.loadFromWave();

   $("#loadlbl").hide();
   $("#eimg").show();
   $("#imgo").fadeIn(300);
}

function enterImageSourceInTextBox(imageSource) {
   if (imageSource) {
     $("#imgurl").val(imageSource);
   }
}

function loadAnnotationsFromState() {
   var state = wave.getState();
   annotateModel = annotateModel || new AnnotateModel();
   annotateView = annotateView || new AnnotateView("#eimg");
   annotateView.reset();
   annotateModel.loadFromWave();
   var annControl;
   annotateModel.iterate(function (annot) {
     annControl = annotateView.draw(annot);
     $(annControl).dblclick(onEditAnnotation);
   });

   var setIsAnnAlways = state.get("set:iaa");
   if (setIsAnnAlways == "1") {
     Settings.alwaysShowAnnotations = true;
     $("#isannalways").attr("checked", true);
     if (curMode != GadMode.EDIT) annotateView.showall();
   } else {
     if (Settings.alwaysShowAnnotations) {
       annotateView.hideall();
       Settings.alwaysShowAnnotations = false;
       $("#isannalways").attr("checked", false);
     }
   }

   if (annotationDone && curMode == GadMode.ANNOTATION) {
     switchMode(GadMode.VIEW);
     annotationDone = false;
     annotateView.showall();
   }

   if (wave.getMode() == wave.Mode.PLAYBACK) annotateView.showall(true);
}

 function setMode() {
   switchMode(wave.getMode() == wave.Mode.EDIT ? GadMode.EDIT : GadMode.VIEW);
 }

 function switchMode(mode) {
   if (curMode != mode) {
     curMode = mode;
     switch (mode) {
       case GadMode.EDIT:
         $("#viewNote").hide();
         $("#editNote").show();
         fixHeight();
         $("#edit").slideDown(250);
         if ($("#imgo").attr("src")) {
           $("#eimg").addClass('softb');
           bindResizable();
         }
         annotateView && annotateView.hideall() && annotateView.cancelEditControl();
         break;
       case GadMode.VIEW:
         $("#imgo").resizable('destroy');
         $("#edit").slideUp(250, function () {
           fixHeight()
         });
         $("#imgurl").val(theImg ? theImg.src : "");
         $("#eimg").removeClass('softb');
         $("#annotform").hide();
         $("#imgo").removeClass('dimimg');
         annotateView && Settings.alwaysShowAnnotations && annotateView.showall();
         $("#editNote").hide();
         break;
       case GadMode.ANNOTATION:
         $("#imgo").addClass('dimimg');
         gadgets.window.adjustHeight(parseInt(imgHeight) + 53);
         $("#viewNote").hide();
         break;
     }
   }
 }

 function loadImageByEnteredURL(fromState) {
   var newImgSrc = $.trim($("#imgurl").val());

   var imageIsNew = !theImg || newImgSrc != theImg.src;
   if (newImgSrc.length > 0 && imageIsNew) {

     if (curMode == GadMode.EDIT) $("#loadlbl").show();

     if (theImg) $("#imgo").hide();

     $("#eimg").hide();
     $("#loader").show();
     theImg = new Image();
     theImg.src = newImgSrc;
     theImg.onload = function () {
       onImgLoad(fromState)
     };
     annotateModel.reset();
   }
 }

 function onImgLoad(fromState) {
   $("#loader").hide();

   $("#imgo").attr("src", theImg.src);
   console.log("$", $);
   console.log("setting attribute of", $("#imgo"));

   if (!fromState) {
     setImageSize(theImg.width, theImg.height);
     var delta = {
       "imgUrl": theImg.src,
       "imgWidth": theImg.width,
       "imgHeight": theImg.height
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
   $("#imgo").fadeIn(300);

 }

 function onAnnotationsSettingsChange() {
   var state = wave.getState()
   state && state.submitValue("set:iaa", $("#isannalways").attr("checked") ? "1" : "0");
 }

 function onDblClick(e) {
   if (annotateView && curMode != GadMode.EDIT && !e.isPropagationStopped()) {
     switchMode(GadMode.ANNOTATION);
     annotateView.cancelEditControl();
     curAnnot = annotateModel.create();
     curAnnot.x = parseInt(e.clientX) - 10;
     curAnnot.y = parseInt(e.clientY) - 10;
     annotateView.addEditControl(curAnnot);
     $("#annotform").show().find("#annotext").val("Enter annotation text").attr("init", "1").css("font-style", "italic");
     $("#removebtn").hide();
   }
 }

 function onHoverInImg() {
   if (curMode == GadMode.VIEW) {
     $("#viewNote").fadeIn()
     annotateView.showall();
   } else if (curMode == GadMode.EDIT) {
     $("#editNote").fadeIn()
   }

 }

 function onHoverOutImg() {
   if (curMode == GadMode.VIEW) $("#viewNote").fadeOut()
   else if (curMode == GadMode.EDIT) $("#editNote").fadeOut()
   if (!Settings.alwaysShowAnnotations && curMode == GadMode.VIEW) annotateView.hideall();
 }

 function setImageSize(width, height) {
   if (curMode == GadMode.EDIT) $("#imgo").resizable('destroy');

   if (width) { 
       $("#imgo").css("width", width).attr("width", width);
   }
   if (height) {
     imgHeight = height;
     $("#imgo").css("height", height).attr("height", height);
     $("#viewNote").css("top", (imgHeight - 22) + "px");
     fixHeight();
   }

   if (curMode == GadMode.EDIT) bindResizable();

 }

 function bindResizable() {
   $("#imgo").resizable({
     resize: function (e, ui) {
       if (ui.size.height > lastHeightSet - 60) {
         lastHeightSet += 20;
         gadgets.window.adjustHeight(lastHeightSet);
       }
     },
     start: onResizeStart,
     stop: onResizeEnd,
     aspectRatio: true,
     minHeight: 20
   });
 }

 function onResizeStart() {
   beforeResizeWidth = parseInt($(this).css("width"));
   beforeResizeHeight = parseInt($(this).css("height"));
   $("#editNote").hide();
 }

 function onResizeEnd() {
   var imgWidth = $("#imgo").attr("width");
   imgHeight = $("#imgo").attr("height");

   var resizeWFactor = beforeResizeWidth > 0 ? (parseInt(imgWidth) / beforeResizeWidth) : 0;
   var resizeHFactor = beforeResizeHeight > 0 ? (parseInt(imgHeight) / beforeResizeHeight) : 0;
   annotateModel.reposition(resizeWFactor, resizeHFactor);
   annotateModel.syncWithWave();

   var delta = {
     "imgWidth": imgWidth,
     "imgHeight": imgHeight
   };
   wave.getState().submitDelta(delta);

   $("#editNote").show();
 }

 function onOkAnnot() {
   curAnnot.caption = $("#annotext").attr("init") != "1" ? $("#annotext").val().trim() : "";
   curAnnot.creatorName = curAnnot.creatorName || wave.getViewer().getDisplayName();
   var annControl = annotateView.finalizeEdit(curAnnot);
   if (annotateModel.isChanged(curAnnot)) {
     annotationDone = true;
     annotateModel.save(curAnnot);
     annotateModel.syncWithWave();
   } else {
     switchMode(GadMode.VIEW);
     $(annControl).dblclick(onEditAnnotation);
   }
 }

 function onCancelAnnot() {
   annotateView.cancelEditControl();
   switchMode(GadMode.VIEW);
 }

 function onRemoveAnnot() {
   annotateView.cancelEditControl();
   annotationDone = true;
   annotateModel.remove(curAnnot);
 }

 function onEditAnnotation(e) {
   e.stopPropagation();
   if (curMode == GadMode.VIEW) {
     switchMode(GadMode.ANNOTATION);
     var annKey = $(e.target).attr("aid");
     curAnnot = annotateModel.getAnnotationByKey(annKey);
     annotateView.addEditControl(curAnnot);
     $("#removebtn").show();
     $("#annotext").val(curAnnot.caption);
   }
 }

 function fixHeight() {
   if (curMode == GadMode.EDIT) lastHeightSet = Math.max(parseInt(imgHeight) + 60, 120);
   else lastHeightSet = parseInt(imgHeight);
   gadgets.window.adjustHeight(lastHeightSet);
 }

 gadgets.util.registerOnLoadHandler(init);