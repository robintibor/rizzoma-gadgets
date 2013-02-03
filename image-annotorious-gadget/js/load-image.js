(function() {

  jQuery(document).ready(function($) {
    var adjustGadgetHeightForImage, imageLoaded, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadImage, loadImageAndAnnotationsFromState, loadImageAndAnnotationsOnStateChange, loadImageFromState, makeImageAnnotatable, removeURLTextAndButton, setImageSource, storeImageSourceInWave, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
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
      removeURLTextAndButton();
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
        return window.loadAnnotationsFromState();
      });
    };
    adjustGadgetHeightForImage = function() {
      var bodyHeight;
      bodyHeight = $('body').height();
      return gadgets.window.adjustHeight(bodyHeight + 90);
    };
    makeImageAnnotatable = function() {
      var image;
      image = $('#imageToAnnotate')[0];
      return anno.makeAnnotatable(image);
    };
    removeURLTextAndButton = function() {
      return $('#imageUrlText, #loadImageButton').remove();
    };
    loadImageAndAnnotationsOnStateChange = function() {
      return wave.setStateCallback(loadImageAndAnnotationsFromState);
    };
    loadImageAndAnnotationsFromState = function() {
      if (!imageLoaded()) {
        return loadImageFromState();
      } else {
        return window.loadAnnotationsFromState();
      }
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
    return loadImageAndAnnotationsOnStateChange();
  });

}).call(this);
