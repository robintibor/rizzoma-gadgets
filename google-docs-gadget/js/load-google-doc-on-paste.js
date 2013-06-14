(function() {
  var adjustHeightOfGadget, googleDocGadget, loadGoogleDocFromTextBox, loadGoogleDocOnEnter, loadGoogleDocOnPaste, removeTextField, setIFrameSource, showIFrame, showIFrameOnLoad;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  googleDocGadget.updateQueryString = function(key, value, url) {
    var hash, re, separator;
    if (!url) {
      url = window.location.href;
    }
    re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
    if (re.test(url)) {
      if (typeof value !== "undefined" && value !== null) {
        url = url.replace(re, '$1' + key + "=" + value + '$2$3');
      } else {
        url = url.replace(re, "$1$3").replace(/(&|\?)$/, "");
      }
    } else {
      if (typeof value !== "undefined" && value !== null) {
        separator = (url.indexOf("?") !== -1 ? "&" : "?");
        hash = url.split("#");
        url = hash[0] + separator + key + "=" + value;
        if (hash[1]) {
          url += "#" + hash[1];
        }
        url;

      }
    }
    return url;
  };

  loadGoogleDocOnEnter = function() {
    return $('#googleDocUrlText').keyup(function(event) {
      var enterKeyCode;
      enterKeyCode = 13;
      if (event.keyCode === enterKeyCode) {
        return loadGoogleDoc();
      }
    });
  };

  loadGoogleDocOnPaste = function() {
    return $('#googleDocUrlText').on("paste", function() {
      return setTimeout(loadGoogleDocFromTextBox, 0);
    });
  };

  loadGoogleDocFromTextBox = function() {
    var enteredUrl, googleDocLink, googleDocLinkForMinimalUI;
    enteredUrl = $('#googleDocUrlText').val();
    googleDocLink = enteredUrl.trim();
    googleDocLinkForMinimalUI = googleDocGadget.updateQueryString("rm", "minimal", googleDocLink);
    googleDocGadget.loadGoogleDoc(googleDocLinkForMinimalUI);
    return googleDocGadget.storeGoogleDocUrlInWave(googleDocLinkForMinimalUI);
  };

  googleDocGadget.loadGoogleDoc = function(googleDocLink) {
    removeTextField();
    showIFrameOnLoad();
    return setIFrameSource(googleDocLink);
  };

  removeTextField = function() {
    return $('#googleDocUrlText').remove();
  };

  setIFrameSource = function(googleDocLink) {
    return $("#googleDocIFrame").attr("src", googleDocLink);
  };

  showIFrameOnLoad = function() {
    return $("#googleDocIFrame").load(showIFrame);
  };

  showIFrame = function() {
    $('#googleDocIFrame').show();
    return adjustHeightOfGadget();
  };

  adjustHeightOfGadget = function() {
    return gadgets.window.adjustHeight();
  };

  googleDocGadget.showUrlEnterBox = function() {
    return jQuery('#googleDocUrlText').show();
  };

  loadGoogleDocOnEnter();

  loadGoogleDocOnPaste();

}).call(this);
