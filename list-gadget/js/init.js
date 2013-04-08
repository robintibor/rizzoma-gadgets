var list;

function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

jQuery(document).ready(function initialize()
{
    var gadgetWidth =  $("body").width()+100;
    gadgetWidth+="px";
    $("#inDiv").css('width', gadgetWidth);
    list = new listObject();
    $("#addLine").hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
    $("#addLine").click(function(){list.addNewLine(true);});
    $("#outDiv").scroll(function(){drawIconsForEachCollumn();});
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67, cEnter = 13;
    var focused;
    $(document).keydown(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = true;
        else if (e.keyCode == vKey && ctrlDown)
        {
            focused = "#" + $(':focus').attr('id');
        }
        else if (e.keyCode == cEnter)
        {
           list.addNewLine(true);
           var id = "#"+list.lines[list.lines.length - 1].cells[0].cellId;
           $(id).focus();
        }
    }).keyup(function(e)
    {
        /*if (focused.length > 0)
        {
            copyPasteToListG(focused);
        }*/
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });
    
   /* $(document).keypress(function(e) {
        var ctrlKey = 17, vKey = 86, cKey = 67, cEnter = 13;
        if(e.which == cEnter) {
           list.addNewLine(true);
           var id = "#"+list.lines[list.lines.length - 1].cells[0].cellId;
           $(id).focus();
        }
        var ctrlDown = false;
    $(document).keydown(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });
    });*/
});

