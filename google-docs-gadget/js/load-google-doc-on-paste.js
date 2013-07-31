(function() {
  var googleDocGadget, loadGoogleDocFromTextBox, loadGoogleDocOnEnter, loadGoogleDocOnPaste, removeTextField, setDocHeight, setIFrameSource, showIFrame, showIFrameAfterFocus, showIFrameAfterLoad, weAreUsingChrome;

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
    var defaultHeight, enteredUrl, googleDocLink, googleDocLinkForMinimalUI;
    defaultHeight = 450;
    enteredUrl = $('#googleDocUrlText').val();
    googleDocLink = enteredUrl.trim();
    googleDocLinkForMinimalUI = googleDocGadget.updateQueryString("rm", "minimal", googleDocLink);
    googleDocGadget.loadGoogleDoc(googleDocLinkForMinimalUI, defaultHeight);
    return googleDocGadget.storeGoogleDocUrlInWave(googleDocLinkForMinimalUI);
  };

  googleDocGadget.loadGoogleDoc = function(googleDocLink, height) {
    removeTextField();
    if (weAreUsingChrome()) {
      showIFrameAfterFocus();
      showIFrameAfterLoad(5000);
    } else {
      showIFrameAfterLoad(100);
    }
    setTimeout(showIFrame, 14000);
    setIFrameSource(googleDocLink);
    return setDocHeight(height);
  };

  removeTextField = function() {
    return $('#googleDocUrlText').remove();
  };

  weAreUsingChrome = function() {
    if ((typeof BrowserDetect !== "undefined" && BrowserDetect !== null)) {
      return BrowserDetect.browser === "Chrome";
    } else {
      return window.chrome != null;
    }
  };

  setIFrameSource = function(googleDocLink) {
    return $("#googleDocIFrame").attr("src", googleDocLink);
  };

  setDocHeight = function(height) {
    return $("#googleDocDiv").height(height);
  };

  showIFrameAfterFocus = function() {
    if (document.activeElement === $('#googleDocIFrame')[0]) {
      return showIFrame();
    } else {
      return setTimeout(showIFrameAfterFocus, 100);
    }
  };

  showIFrameAfterLoad = function(timeOut) {
    return $('#googleDocIFrame').load(function() {
      return setTimeout(showIFrame, timeOut);
    });
  };

  showIFrame = function() {
    $('#googleDocIFrame').show();
    return gadgets.window.adjustHeight();
  };

  googleDocGadget.showUrlEnterBox = function() {
    return jQuery('#googleDocUrlText').show();
  };

  loadGoogleDocOnEnter();

  loadGoogleDocOnPaste();

}).call(this);
