(function() {
  var addMenu, docHasMenu, getCurrentDocLink, googleDocGadget, onClickToggleGoogleDocMenu, removeMenu, toggleGoogleDocMenu;

  googleDocGadget = window.googleDocGadget || {};

  window.googleDocGadget = googleDocGadget;

  console.log("hi toggle");

  onClickToggleGoogleDocMenu = function() {
    return $('#toggleMenuButton').click(toggleGoogleDocMenu);
  };

  toggleGoogleDocMenu = function() {
    if (docHasMenu()) {
      return removeMenu();
    } else {
      return addMenu();
    }
  };

  docHasMenu = function() {
    var currentDocLink;
    currentDocLink = getCurrentDocLink();
    return currentDocLink.indexOf("rm=minimal") !== -1;
  };

  getCurrentDocLink = function() {
    return $('#googleDocIFrame').attr('src');
  };

  removeMenu = function() {
    var currentDocLink, docLinkWithoutMenu;
    currentDocLink = getCurrentDocLink();
    docLinkWithoutMenu = googleDocGadget.updateQueryString("rm", null, currentDocLink);
    $('#googleDocIFrame').attr('src', docLinkWithoutMenu);
    return $('#toggleMenuButton').text("Hide Google Doc Menu");
  };

  addMenu = function() {
    var currentDocLink, docLinkWithMenu;
    currentDocLink = getCurrentDocLink();
    docLinkWithMenu = googleDocGadget.updateQueryString("rm", "minimal", currentDocLink);
    $('#googleDocIFrame').attr('src', docLinkWithMenu);
    return $('#toggleMenuButton').text("Show Google Doc Menu");
  };

  onClickToggleGoogleDocMenu();

}).call(this);
