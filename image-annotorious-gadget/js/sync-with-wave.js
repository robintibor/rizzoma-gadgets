(function() {
  var getImageSourceFromWave, imageAnnotationGadget, imageSourceStoredInWave, loadAnnotationsFromWave, loadImageFromWave, loadImageSizeFromWave, onWaveStateChange;

  imageAnnotationGadget = window.imageAnnotationGadget || {};

  window.imageAnnotationGadget = imageAnnotationGadget;

  imageAnnotationGadget.wave = {};

  onWaveStateChange = function() {
    loadImageSizeFromWave();
    return loadImageFromWave(loadAnnotationsFromWave);
  };

  loadImageFromWave = function(callback) {
    var imageSource;
    if (!imageAnnotationGadget.imageLoaded()) {
      if (imageSourceStoredInWave()) {
        imageSource = getImageSourceFromWave();
        return imageAnnotationGadget.loadImage(imageSource, callback);
      }
    } else {
      if (callback != null) {
        return callback();
      }
    }
  };

  imageSourceStoredInWave = function() {
    return wave.getState().get("imageSource") != null;
  };

  getImageSourceFromWave = function() {
    return wave.getState().get("imageSource");
  };

  loadAnnotationsFromWave = function() {
    var annotations;
    annotations = imageAnnotationGadget.wave.getAnnotationsFromWave();
    if ((annotations != null) && imageAnnotationGadget.annotableImageExists()) {
      return imageAnnotationGadget.addOrRemoveAnnotationsInPicture(annotations);
    }
  };

  imageAnnotationGadget.wave.getAnnotationsFromWave = function() {
    var annotations, annotationsString;
    annotationsString = wave.getState().get("annotations");
    annotations = JSON.parse(annotationsString);
    return annotations;
  };

  imageAnnotationGadget.wave.storeImageSource = function(imageSource) {
    return wave.getState().submitValue("imageSource", imageSource);
  };

  imageAnnotationGadget.wave.saveAnnotations = function(annotations) {
    var annotationsString;
    annotationsString = JSON.stringify(annotations);
    return wave.getState().submitValue("annotations", annotationsString);
  };

  loadImageSizeFromWave = function() {
    var imageSize, imageSizeString;
    imageSizeString = wave.getState().get("imageSize");
    if ((imageSizeString != null)) {
      imageSize = JSON.parse(imageSizeString);
      if (imageAnnotationGadget.imageLoaded()) {
        return imageAnnotationGadget.setImageSizeAndRedrawAnnotations(imageSize);
      } else {
        return imageAnnotationGadget.setImageSize(imageSize);
      }
    }
  };

  imageAnnotationGadget.wave.saveNewImageSize = function(newSize) {
    return wave.getState().submitValue("imageSize", JSON.stringify(newSize));
  };

  wave.setStateCallback(onWaveStateChange);

}).call(this);
