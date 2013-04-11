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
    updateId();
}

function updateGadgetWidth(goToEnd)
{
    var listBoxWidth = $("#listBox").width();
    var gadgetWidth =  $("body").width();
    //console.log("lw="+listBoxWidth);
    //console.log("gw="+gadgetWidth);
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
        if (goToEnd == true)
            $("#outDiv").scrollLeft($("#outDiv").width());
        gadgets.window.adjustHeight($('body').height());
    } else if (gadgetWidth > (listBoxWidth))
    {
        gadgetWidth+="px";
        //listBoxWidth-=200;
        listBoxWidth+="px";
        $("#inDiv").css('width', gadgetWidth+100);
        $("#outDiv").css('width', gadgetWidth);
        $("#outDiv").scrollLeft(0);
        $("#outDiv").css('overflow-x', "hidden");
        gadgets.window.adjustHeight($('body').height());
    }
}
function adjustCellsWidth(columnId, text, cellId)
{
    var collumnIndex = 0;
    for (var i=0; i < list.lines[0].cells.length; i++)
        if (list.lines[0].cells[i].columnId == columnId)
        {
            collumnIndex = i;
            break;
        }
    var fooObj =  $('#bufDivUnvisible');
    var newWidth = 0;
    text = text.replace(/ /g, "*");
    var result = cellId.search(/#line0.+/);
    if (result == -1)
        newWidth = $('#bufDivUnvisible').attr('class', 'bufClass2').html(text).width();
    else
        newWidth = $('#bufDivUnvisible').attr('class', 'bufClass1').html(text).width();
    var titleCellId = "#line0cell" + columnId; 
    var oldWidth = $(titleCellId).width();
    /*console.log("newWidth->" + newWidth);
    console.log(fooObj);
    console.log(titleCellId +" oldWidth->" + oldWidth);*/
    if (newWidth > oldWidth )
    {
        
        //$(titleCellId).width(newWidth - padding);
        newWidth += "px";
        for (var i = 0; i < list.lines.length; i++)
        {
            var cellId = "#" + list.lines[i].cells[collumnIndex].cellId;
            $(cellId).width(newWidth);
        }
    } else
    {
       // console.log(cellId);
        $(cellId).width(oldWidth);
    }
    updateGadgetWidth();
}
function drawIconsForEachCollumn()
{
    for (var i=0; i < list.lines[0].cells.length; i++)
    {
        var collumnIndex = list.lines[0].cells[i].columnId;
        var closerId = "Closer_" + list.lines[0].cells[i].columnId;
        var sorterId = "Sorter_" + list.lines[0].cells[i].columnId;
        var closerIdObj = "#"+closerId;
        var sorterIdObj = "#"+sorterId;
        //console.log("closerIdObj->");
        //console.log($(closerIdObj));
        if ($(closerIdObj).length  == 0)
        {
            var cellObj='#line0cell'+list.lines[0].cells[i].columnId;
            var x = $(cellObj).position().left;
            var y = $(cellObj).position().top;
            var width = $(cellObj).width();
            $("#line0").append('<span title="remove column" id="'+closerId+'" style="position:absolute; z-index:1000; cursor:pointer;color:#B6C4CF" class="icon-close1"></span>');
            $("#line0").append('<span title="sort ascending" id="'+sorterId+'" style="position:absolute; z-index:1000; cursor:pointer;color:#B6C4CF" class="icon-arrow-down"></span>');
            $(closerIdObj).css("left", x);
            $(closerIdObj).css("top", y);
            $(sorterIdObj).css("left", x+width);
            $(sorterIdObj).css("top", y);
            $(closerIdObj).hide();
            $(sorterIdObj).hide();
            $(closerIdObj).hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
            $(sorterIdObj).hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
            
            // sort eventhandler
            $(sorterIdObj).click(function(){
                if ( $(this).attr('class') == 'icon-arrow-down')
                {
                    $(this).attr('class', "icon-arrow-up");
                    $(this).attr('title', "sort descending");
                    var id = $(this).attr("id").split('_');
                    sortGivenCollumn(id[1], true);
                }
                else if ($(this).attr('class') == 'icon-arrow-up')
                {
                    $(this).attr('class', "icon-arrow-left");
                    $(this).attr('title', "back to insertion order");
                    var id = $(this).attr("id").split('_');
                    sortGivenCollumn(id[1], false);
                } else
                {
                    $(this).attr('class', "icon-arrow-down");
                    $(this).attr('title', "sort ascending");
                    var id = $(this).attr("id").split('_');
                    sortGivenCollumn(-1, true);
                }
            });
            
            // close eventhandler
            $(closerIdObj).click(function(){
                var id = $(this).attr("id").split('_');
                removeGivenCollumn(id[1], true);
                saveLinesToWave();
            });
            //$(closerIdObj).text( "left: " + x + ", top: " + y );
        } else 
        {
            var cellObj='#line0cell'+list.lines[0].cells[i].columnId;
            var x = $(cellObj).position().left;
            var y = $(cellObj).position().top;
            var width = $(cellObj).width();
            $(closerIdObj).css("left", x);
            $(closerIdObj).css("top", y);
            $(sorterIdObj).css("left", x+width);
            $(sorterIdObj).css("top", y);
        }
    }
}
function makeHiddenAllCollumnsButNotGivenOne(clId)
{
    for (var i = 0; i < list.lines[0].cells.length; i++)
    if (list.lines[0].cells[i].columnId != clId)
    {
        var closerId = "#Closer_" + list.lines[0].cells[i].columnId;
        var sorterId = "#Sorter_" + list.lines[0].cells[i].columnId;
        $(closerId).hide();
        $(sorterId).hide();
    }
}
function sortGivenCollumn(clId, AtoZ)
{
    //console.log(clId+" "+ AtoZ);
    var collumnIndex = 0;
    var buf = new Array();
    if (clId >= 0)
    {
        for (var i = 0; i < list.lines[0].cells.length; i++)
        if (list.lines[0].cells[i].columnId == clId)
        {
            collumnIndex = i;
            break;
        }
    } else // last place in in each buf line is reserved for magicIdOfLine
    {
        collumnIndex = list.lines[0].cells.length;
    }
    // read
    for (var i = 1; i < list.lines.length; i++)
    {
        buf[i-1] = new Array();
        for (var j = 0; j < list.lines[i].cells.length; j++)
        {
            buf[i-1].push(list.lines[i].cells[j].text);
        }
        // last line for magicIdofLines, so we can rollback the insertionorder
        buf[i-1].push(list.lines[i].magicLineId);
    }
    
    // sort
    if (AtoZ)
        buf.sort(function(a,b) {
            
            var isnum1 = parseFloat(a[collumnIndex]);
            var isnum2 = parseFloat(b[collumnIndex]);
            //console.log(isnum1+" "+isnum2);
            if (!isNaN(isnum1) && !isNaN(isnum2))
                return (isnum1 > isnum2)?1:((isnum1==isnum2)?0:-1);
            else
                return (a[collumnIndex] >  b[collumnIndex])?1:((a[collumnIndex]== b[collumnIndex])?0:-1);
        } );
    else
        buf.sort(function(a,b) {
            
            var isnum1 = parseFloat(a[collumnIndex]);
            var isnum2 = parseFloat(b[collumnIndex]);
            if (!isNaN(isnum1) && !isNaN(isnum2))
                return (isnum1 < isnum2) ? 1 : ((isnum1==isnum2) ? 0 : -1);
            else
                return (a[collumnIndex] <  b[collumnIndex])?1:((a[collumnIndex]== b[collumnIndex])?0:-1);
        } );

    /*console.log("collumnIndex "+ collumnIndex);
    for (var i = 0; i < list.lines.length; i++)
    {
        console.log(buf[i]);
    }*/
    // write back
    for (var i = 1; i < list.lines.length; i++)
    {
        for (var j = 0; j < list.lines[i].cells.length; j++)
        {
            list.lines[i].cells[j].setText(buf[i-1][j]);
        }
        list.lines[i].magicLineId = buf[i - 1][buf[0].length - 1];
    }
    saveLinesToWave();
}
function removeGivenCollumn(clId)
{
    var closerId = "#Closer_" + clId;
    var sorterId = "#Sorter_" + clId;
    $(closerId).remove();
    $(sorterId).remove();
    var collumnIndex = 0;
    for (var i = 0; i < list.lines[0].cells.length; i++)
    if (list.lines[0].cells[i].columnId == clId)
    {
        collumnIndex = i;
        break;
    }
    for (var i = 0; i < list.lines.length; i++)
    {
        var cellObjStr = "#" + list.lines[i].lineID + "cell" + clId;
        //console.log("removeCollumn");
        //console.log(list.lines[i].cells);
        $(cellObjStr).remove();
        list.lines[i].cells.splice(collumnIndex, 1);
        //console.log(list.lines[i].cells);
    }
    drawIconsForEachCollumn();
    updateGadgetWidth();
}
function updateId()
{
    for (var i=1; i < list.lines.length; i++)
    {
        var id = "#counter" + list.lines[i].lineID;
        $(id).val(i);
    }
}
function copyPasteToListG(leftTopId)
{
    var buf = $(leftTopId).val().split('\n');
    console.log(buf);
}
function test(id)
{
    $('body').append('<div id="divTest" style="position:absolute; width:1000px; height:600px; opacity: 0.5;background-color: #000;z-index: 1;"></div>');
    var divId = "#"+"divTest"+id;
    $(divId).attr("style", "position:absolute; width:1000px; height:600px; opacity:0.5;");
    $(divId).left(id*30+100);
    $(divId).top(id*30+100);
    
}