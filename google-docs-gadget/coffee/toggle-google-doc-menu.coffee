googleDocGadget = window.googleDocGadget || {}
window.googleDocGadget = googleDocGadget
console.log("hi toggle")

onClickToggleGoogleDocMenu = ->
  $('#toggleMenuButton').click(toggleGoogleDocMenu)

toggleGoogleDocMenu = ->
  if (docHasMenu())
    removeMenu()
  else
    addMenu()
    
docHasMenu = ->
  # doc has menu if iframeurl contains rm=minimal as get parameter of url
  currentDocLink = getCurrentDocLink()
  return currentDocLink.indexOf("rm=minimal") != -1

getCurrentDocLink = ->
  return $('#googleDocIFrame').attr('src')

removeMenu = ->
  currentDocLink = getCurrentDocLink()
  # this will remove rm parameter from link
  docLinkWithoutMenu = googleDocGadget.updateQueryString("rm", null, currentDocLink)
  $('#googleDocIFrame').attr('src', docLinkWithoutMenu)
  $('#toggleMenuButton').text("Hide Google Doc Menu")
  
addMenu = ->
  currentDocLink = getCurrentDocLink()
  docLinkWithMenu = googleDocGadget.updateQueryString("rm", "minimal", currentDocLink)
  $('#googleDocIFrame').attr('src', docLinkWithMenu)
  $('#toggleMenuButton').text("Show Google Doc Menu")
  

onClickToggleGoogleDocMenu()