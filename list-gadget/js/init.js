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
});

function removeLine(id)
{

    for (var i = 0; i < list.lines.length; i++)
    {
       if (list.lines[i].lineID == id){
           list.lines.splice(i, 1);
           break;
       }
    }
    id = "#"+id;
    $(id).remove();
    gadgets.window.adjustHeight($('body').height());
}

function updateGadgetWidth()
{
    var listBoxWidth = $("#listBox").width();
    var gadgetWidth =  $("body").width();
    console.log("lw="+listBoxWidth);
    console.log("gw="+gadgetWidth);
    if (gadgetWidth <= listBoxWidth)
    {
        //var styleStr = "overflow-x:scroll; width:"+gadgetWidth+"px;";
        //console.log(styleStr);
        gadgetWidth+="px";
        listBoxWidth+=200;
        listBoxWidth+="px";
        $("#inDiv").css('width', listBoxWidth);
        $("#outDiv").css('width', gadgetWidth);
        $("#outDiv").css('overflow-x', "scroll");
        gadgets.window.adjustHeight($('body').height());
    }
}