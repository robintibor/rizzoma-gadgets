(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jQuery(document).ready(function($) {
    var addAnnotationsToPicture, adjustGadgetHeightForImage, annotableImageExists, getAnnotationsFromState, imageLoaded, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadAnnotationsFromState, loadImage, loadImageAndAnnotationsFromState, loadImageAndAnnotationsOnStateChange, loadImageFromState, makeImageAnnotatable, saveAnnotationsOnChange, saveAnnotationsToWave, saveNewAnnotationToWave, setImageSource, storeImageSourceInWave, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
    loadAndStoreImageOnButtonClick = function() {
      return $('#loadImageButton').click(loadAndStoreImageFromUrlText);
    };
    loadAndStoreImageFromUrlText = function() {
      var urlText;
      urlText = $('#imageUrlText').val();
      storeImageSourceInWave(urlText);
      return loadImage(urlText);
    };
    storeImageSourceInWave = function(imageSource) {
      return wave.getState().submitValue("imageSource", imageSource);
    };
    loadImage = function(imageSource) {
      console.log("loading image");
      setImageSource(imageSource);
      return whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight();
    };
    setImageSource = function(imageSource) {
      return $('#imageToAnnotate').attr('src', imageSource);
    };
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = function() {
      return $('#imageToAnnotate').load(function() {
        adjustGadgetHeightForImage();
        makeImageAnnotatable();
        return loadAnnotationsFromState();
      });
    };
    adjustGadgetHeightForImage = function() {
      var bodyHeight;
      bodyHeight = $('body').height();
      return gadgets.window.adjustHeight(bodyHeight);
    };
    makeImageAnnotatable = function() {
      var image;
      image = $('#imageToAnnotate')[0];
      console.log("making annotatable!");
      return anno.makeAnnotatable(image);
    };
    loadImageAndAnnotationsOnStateChange = function() {
      return wave.setStateCallback(loadImageAndAnnotationsFromState);
    };
    loadImageAndAnnotationsFromState = function() {
      if (!imageLoaded()) {
        loadImageFromState();
      }
      return loadAnnotationsFromState();
    };
    imageLoaded = function() {
      return $('#imageToAnnotate').attr('src') != null;
    };
    loadImageFromState = function() {
      var imageSource;
      imageSource = wave.getState().get("imageSource");
      if ((imageSource != null)) {
        return loadImage(imageSource);
      }
    };
    loadAndStoreImageOnButtonClick();
    loadImageAndAnnotationsOnStateChange();
    /* annotation part
    */

    loadAnnotationsFromState = function() {
      var annotations;
      annotations = getAnnotationsFromState();
      if ((annotations != null) && annotableImageExists()) {
        return addAnnotationsToPicture(annotations);
      }
    };
    getAnnotationsFromState = function() {
      var annotations, annotationsString;
      annotationsString = wave.getState().get("annotations");
      annotations = JSON.parse(annotationsString);
      return annotations;
    };
    annotableImageExists = function() {
      return $('.annotorious-annotationlayer').length > 0;
    };
    addAnnotationsToPicture = function(annotations) {
      var annotation, existingAnnotations, _i, _len;
      console.log("adding annotations", annotations);
      existingAnnotations = anno.getAnnotations();
      for (_i = 0, _len = annotations.length; _i < _len; _i++) {
        annotation = annotations[_i];
        if (__indexOf.call(existingAnnotations, annotation) < 0) {
          anno.addAnnotation(annotation);
        }
      }
      return console.log("now annotations", anno.getAnnotations());
    };
    saveAnnotationsOnChange = function() {
      return anno.addHandler('onAnnotationCreated', saveNewAnnotationToWave);
    };
    saveNewAnnotationToWave = function(annotation) {
      var annotations;
      console.log("saving", annotation);
      annotations = getAnnotationsFromState() || [];
      if (__indexOf.call(annotations, annotation) < 0) {
        annotations.push(annotation);
      }
      return saveAnnotationsToWave(annotations);
    };
    saveAnnotationsToWave = function(annotations) {
      var annotationsString;
      annotationsString = JSON.stringify(annotations);
      return wave.getState().submitValue("annotations", annotationsString);
    };
    return saveAnnotationsOnChange();
  });

}).call(this);
