(function() {
  var imageAnnotationGadget;

  imageAnnotationGadget = window.imageAnnotationGadget || {};

  window.imageAnnotationGadget = imageAnnotationGadget;

  jQuery(document).ready(function($) {
    var displayWarningToUser, imageAmongPastedItems, imageHasNoSizeSet, imagePastedWithWebUrl, imageSourceIsSmallEnough, loadAndStoreImage, loadAndStoreImageFromUrlText, loadAndStoreImageOnButtonClick, loadImageFromImageFile, loadImageFromPastedData, loadImageFromPastedImageFile, loadImageFromPastedWebImage, loadImageFromPastedWebImageHTML, loadImageIfImagePasted, loadImageOnPaste, makeImageAnnotatable, removeLoadMenu, retainCurrentSizeAndRemoveMaxWidthFromImage, setAnnotationCanvasSizesToImageSize, setDefaultMaxImageWidth, setImageSource, showSizeWarningToUser, urlHasText, whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight;
    loadAndStoreImageOnButtonClick = function() {
      return $('#loadImageButton').click(loadAndStoreImageFromUrlText);
    };
    loadAndStoreImageFromUrlText = function() {
      var urlText;
      urlText = $('#imageUrlText').val();
      if (urlHasText(urlText)) {
        return loadAndStoreImage(urlText);
      } else {
        return displayWarningToUser("Textbox empty! :( Please enter an URL, then click <b>Load Image</b> :)");
      }
    };
    urlHasText = function(urlText) {
      return urlText !== "";
    };
    loadAndStoreImage = function(imageSource) {
      imageAnnotationGadget.wave.storeImageSource(imageSource);
      return imageAnnotationGadget.loadImage(imageSource);
    };
    imageAnnotationGadget.loadImage = function(imageSource, callback) {
      removeLoadMenu();
      setDefaultMaxImageWidth();
      setImageSource(imageSource);
      return whenImageLoadedMakeAnnotatableAndAdjustGadgetHeight(callback);
    };
    removeLoadMenu = function() {
      return $('#loadImageMenu').remove();
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
        retainCurrentSizeAndRemoveMaxWidthFromImage();
        makeImageAnnotatable();
        imageAnnotationGadget.showAnnotationsButton();
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
      var annotationCanvas, imageHeight, imageWidth, _i, _len, _ref, _results;
      imageWidth = $('#imageToAnnotate').width();
      imageHeight = $('#imageToAnnotate').height();
      _ref = $('canvas.annotorious-opacity-fade');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        annotationCanvas = _ref[_i];
        $(annotationCanvas).width(imageWidth);
        annotationCanvas.width = imageWidth;
        $(annotationCanvas).height(imageHeight);
        _results.push(annotationCanvas.height = imageHeight);
      }
      return _results;
    };
    retainCurrentSizeAndRemoveMaxWidthFromImage = function() {
      var currentImageHeight, currentImageWidth;
      currentImageWidth = $('#imageToAnnotate').width();
      currentImageHeight = $('#imageToAnnotate').height();
      $('#imageToAnnotate').width(currentImageWidth);
      $('#imageToAnnotate').height(currentImageHeight);
      return $('#imageToAnnotate').css('max-width', '');
    };
    imageAnnotationGadget.imageLoaded = function() {
      return $('#imageToAnnotate').attr('src') != null;
    };
    loadImageOnPaste = function() {
      return $('#imageUrlText').on('paste', loadImageFromPastedData);
    };
    loadImageFromPastedData = function(event) {
      return loadImageIfImagePasted(event);
    };
    loadImageIfImagePasted = function(event) {
      var clipboardData, imagePasted, items;
      clipboardData = event.clipboardData || event.originalEvent.clipboardData;
      items = clipboardData.items;
      imagePasted = imageAmongPastedItems(items);
      if (imagePasted && imagePastedWithWebUrl(items)) {
        return loadImageFromPastedWebImage(items);
      } else if (imagePasted) {
        return loadImageFromPastedImageFile(items);
      }
    };
    imageAmongPastedItems = function(items) {
      var item, _i, _len;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.type.indexOf("image") === 0) {
          return true;
        }
      }
      return false;
    };
    imagePastedWithWebUrl = function(items) {
      return items[0].type === "text/html" && items[1].type.indexOf("image") === 0;
    };
    loadImageFromPastedWebImage = function(items) {
      var htmlImageItem;
      htmlImageItem = items[0];
      return htmlImageItem.getAsString(loadImageFromPastedWebImageHTML);
    };
    loadImageFromPastedWebImageHTML = function(htmlString) {
      var htmlObject, imageSource;
      htmlObject = $(htmlString);
      imageSource = htmlObject.filter('img')[0].src;
      return loadAndStoreImage(imageSource);
    };
    loadImageFromPastedImageFile = function(items) {
      var item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.type.indexOf("image") === 0) {
          _results.push(loadImageFromImageFile(item));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    loadImageFromImageFile = function(item) {
      var imageFile, imageReader;
      imageFile = item.getAsFile();
      imageReader = new FileReader();
      imageReader.onload = function(event) {
        var base64ImageSource;
        base64ImageSource = event.target.result;
        if (imageSourceIsSmallEnough(base64ImageSource)) {
          return loadAndStoreImage(base64ImageSource);
        } else {
          return showSizeWarningToUser();
        }
      };
      return imageReader.readAsDataURL(imageFile);
    };
    imageSourceIsSmallEnough = function(imageSource) {
      var sourceInKiloBytes;
      sourceInKiloBytes = imageSource.length / 1024;
      return sourceInKiloBytes < 500;
    };
    showSizeWarningToUser = function() {
      return displayWarningToUser('Image too big for pasting directly, paste image into rizzoma and copy URL instead :)');
    };
    displayWarningToUser = function(warningText) {
      return jQuery('#imageTooBigText').html(warningText);
    };
    loadAndStoreImageOnButtonClick();
    return loadImageOnPaste();
  });

}).call(this);
