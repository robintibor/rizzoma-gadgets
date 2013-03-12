(function() {
  var imageAnnotationGadget;

  imageAnnotationGadget = window.imageAnnotationGadget || {};

  window.imageAnnotationGadget = imageAnnotationGadget;

  jQuery(document).ready(function($) {
    var imageHasNoSizeSet, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, makeImageAnnotatable, removeMaxWidthFromImage, removeURLTextAndButton, setAnnotationCanvasSizesToImageSize, setDefaultMaxImageWidth, setImageSource, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
    loadAndStoreImageOnButtonClick = function() {
      return $('#loadImageButton').click(loadAndStoreImageFromUrlText);
    };
    loadAndStoreImageFromUrlText = function() {
      var urlText;
      urlText = $('#imageUrlText').val();
      imageAnnotationGadget.wave.storeImageSource(urlText);
      return imageAnnotationGadget.loadImage(urlText);
    };
    imageAnnotationGadget.loadImage = function(imageSource, callback) {
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
        imageAnnotationGadget.adjustGadgetHeightForImage();
        makeImageAnnotatable();
        removeMaxWidthFromImage();
        if (callback != null) {
          return callback();
        }
      });
    };
    imageAnnotationGadget.adjustGadgetHeightForImage = function() {
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
    imageAnnotationGadget.imageLoaded = function() {
      return $('#imageToAnnotate').attr('src') != null;
    };
    return loadAndStoreImageOnButtonClick();
  });

}).call(this);
