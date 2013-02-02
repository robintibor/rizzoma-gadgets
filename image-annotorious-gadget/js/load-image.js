(function() {

  jQuery(document).ready(function($) {
    var adjustGadgetHeightForImage, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadImage, loadImageFromState, loadImageOnStateChange, makeImageAnnotatable, setImageSource, storeImageSourceInWave, whenImageLoadedAdjustGadgetHeight;
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
      setImageSource(imageSource);
      whenImageLoadedAdjustGadgetHeight();
      return makeImageAnnotatable();
    };
    setImageSource = function(imageSource) {
      return $('#imageToAnnotate').attr('src', imageSource);
    };
    whenImageLoadedAdjustGadgetHeight = function() {
      return $('#imageToAnnotate').load(adjustGadgetHeightForImage);
    };
    adjustGadgetHeightForImage = function() {
      var bodyHeight;
      bodyHeight = $('body').height();
      return gadgets.window.adjustHeight(bodyHeight);
    };
    makeImageAnnotatable = function() {
      var image;
      image = $('#imageToAnnotate')[0];
      return anno.makeAnnotatable(image);
    };
    loadImageOnStateChange = function() {
      return wave.setStateCallback(loadImageFromState);
    };
    loadImageFromState = function() {
      var imageSource;
      imageSource = wave.getState().get("imageSource");
      return loadImage(imageSource);
    };
    loadAndStoreImageOnButtonClick();
    return loadImageOnStateChange();
  });

}).call(this);
