(function() {

  jQuery(document).ready(function($) {
    var getImageSourceFromWave, imageHasNoSizeSet, imageSourceStoredInWave, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadImage, makeImageAnnotatable, removeMaxWidthFromImage, removeURLTextAndButton, setAnnotationCanvasSizesToImageSize, setDefaultMaxImageWidth, setImageSource, storeImageSourceInWave, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
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
    loadImage = function(imageSource, callback) {
      removeURLTextAndButton();
      setDefaultMaxImageWidth();
      setImageSource(imageSource);
      return whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback);
    };
    removeURLTextAndButton = function() {
      return $('#imageUrlText, #loadImageButton').remove();
    };
    setImageSource = function(imageSource) {
      return $('#imageToAnnotate').attr('src', imageSource);
    };
    setDefaultMaxImageWidth = function() {
      if (imageHasNoSizeSet()) {
        return $('#imageToAnnotate').css('max-width', '600px');
      }
    };
    imageHasNoSizeSet = function() {
      return jQuery('#imageToAnnotate').width() === 0;
    };
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = function(callback) {
      return $('#imageToAnnotate').load(function() {
        window.adjustGadgetHeightForImage();
        makeImageAnnotatable();
        removeMaxWidthFromImage();
        if (callback != null) {
          return callback();
        }
      });
    };
    window.adjustGadgetHeightForImage = function() {
      var bodyHeight;
      bodyHeight = $('body').height();
      return gadgets.window.adjustHeight(bodyHeight + 10);
    };
    makeImageAnnotatable = function() {
      var image;
      image = $('#imageToAnnotate')[0];
      anno.makeAnnotatable(image);
      return setAnnotationCanvasSizesToImageSize();
    };
    setAnnotationCanvasSizesToImageSize = function() {
      var annotationCanvas, imageWidth, _i, _len, _ref, _results;
      imageWidth = $('#imageToAnnotate').width();
      _ref = $('canvas.annotorious-opacity-fade');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        annotationCanvas = _ref[_i];
        $(annotationCanvas).width(imageWidth);
        _results.push(annotationCanvas.width = imageWidth);
      }
      return _results;
    };
    removeMaxWidthFromImage = function() {
      return $('#imageToAnnotate').css('max-width', '');
    };
    window.loadImageFromWave = function(callback) {
      var imageSource;
      if (!window.imageLoaded()) {
        if (imageSourceStoredInWave()) {
          imageSource = getImageSourceFromWave();
          return loadImage(imageSource, callback);
        }
      } else {
        if (callback != null) {
          return callback();
        }
      }
    };
    window.imageLoaded = function() {
      return $('#imageToAnnotate').attr('src') != null;
    };
    imageSourceStoredInWave = function() {
      return wave.getState().get("imageSource") != null;
    };
    getImageSourceFromWave = function() {
      return wave.getState().get("imageSource");
    };
    return loadAndStoreImageOnButtonClick();
  });

}).call(this);
