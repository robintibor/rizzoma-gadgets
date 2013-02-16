(function() {

  jQuery(document).ready(function($) {
    var adjustGadgetHeightForImage, getImageSourceFromWave, imageSourceStoredInWave, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadImage, makeImageAnnotatable, removeURLTextAndButton, setImageSource, storeImageSourceInWave, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
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
      setImageSource(imageSource);
      return whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback);
    };
    removeURLTextAndButton = function() {
      return $('#imageUrlText, #loadImageButton').remove();
    };
    setImageSource = function(imageSource) {
      return $('#imageToAnnotate').attr('src', imageSource);
    };
    whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight = function(callback) {
      return $('#imageToAnnotate').load(function() {
        adjustGadgetHeightForImage();
        makeImageAnnotatable();
        if (callback != null) {
          return callback();
        }
      });
    };
    adjustGadgetHeightForImage = function() {
      var bodyHeight;
      bodyHeight = $('body').height();
      return gadgets.window.adjustHeight(bodyHeight + 6);
    };
    makeImageAnnotatable = function() {
      var image;
      image = $('#imageToAnnotate')[0];
      return anno.makeAnnotatable(image);
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
