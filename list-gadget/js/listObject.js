//______________________________________________________________________________
function listObject(){
    // Variables
    this.lines = new Array();
    this.columnsOrder = new Array();
    this.linesOrder = new Array();
    this.lineMagicID=0;
    this.collumnMagicID=0;
    // Methods
    this.addNewLine = function(saveToWave)
    {
        var id = this.lineMagicID;
        this.lineMagicID++;
        this.lines.push(new lineObject());
        var clId = 0;
        if (id!=0)
        {
            clId = (((this.lines.length) % 2) + 1);
            this.lines[this.lines.length-1].initLine(id, clId, this.lines[this.lines.length-2].htmlRef);
            for (var i=0; i < this.lines[this.lines.length - 2].cells.length; i++)
            {
                this.lines[this.lines.length-1].addNewCell(this.lines[this.lines.length - 2].cells[i].columnId, null);
                // take width from line before
                var cellId = "#" + this.lines[this.lines.length-1].cells[i].cellId;
                var titleCellId = "#line0cell" + i; 
                $(cellId).width($(titleCellId).width());
            }
            if (saveToWave)
                submitNewLineToWave();
        }
        else
        {
            this.lines[this.lines.length-1].initTitleLine();
            this.lines[this.lines.length-1].addNewCell(this.collumnMagicID,null);
            this.collumnMagicID++;
            submitNewColumnToWave();
        }
        gadgets.window.adjustHeight($('body').height());
        updateId();
    }
    // load line, that allready exist. For example by loading frome wave
    this.loadLine = function(lineId, cellsToLoad, magicLId, lineBefore, index)
    {
        //console.log("lId->"+lineId);
        if (lineId == "line0")
        {
            this.lines.push(new lineObject());
            this.lines[this.lines.length - 1].loadTitleLine(cellsToLoad);
        }
        else
        {
            var clId = (((this.lines.length+1) % 2) + 1);
            if (lineBefore == null)
            {
                this.lines.push(new lineObject());
                this.lines[this.lines.length-1].loadLine(lineId, cellsToLoad, clId, 
                                this.lines[this.lines.length-2].htmlRef, magicLId);
            }
            else
            {
                this.lines.splice(index, new lineObject());
                this.lines[index].loadLine(lineId, cellsToLoad, clId, 
                                lineBefore, magicLId);
            }
        }            
        gadgets.window.adjustHeight($('body').height());
    }
    this.addNewColumn = function(saveToWave)
    {
        for (var i=0; i < this.lines.length; i++){
            this.lines[i].addNewCell(this.collumnMagicID);
        }
        this.collumnMagicID++;
        if (saveToWave)
            submitNewColumnToWave();
        updateGadgetWidth(true);
        drawIconsForEachCollumn()
    }
    this.insertColumn = function(id, idAfter)
    {
        for (var i=0; i < this.lines.length; i++){
            this.lines[i].addNewCell(id, idAfter);
        }
        updateGadgetWidth(true);
        drawIconsForEachCollumn();
    }
    
}
//______________________________________________________________________________
function lineObject(){
    // $('<div>').append($('#item-of-interest').clone()).html(); 
    // Variables
    this.cells = new Array();
    this.htmlRef;
    this.classId;
    this.lineID;
    this.magicLineId;
    // Methods
    this.initTitleLine =  function()
    {
        this.classId = 0;
        this.magicLineId = 0;
        var str = '<div id="line0">'
                    + '<input id="counterline0"; style="width:29px; border-right:0px solid #E6ECF1; border-bottom:1px solid white; margin-right:1px; padding-right:0px; padding-left:0px;" class="cells0"; value=""; disabled>'
                    + '<span title="add new column" id="line0Add" style="cursor:pointer; color:#B6C4CF" class="icon-plus"></span>'
                +'</div>';
        $('#listBox').append(str);
        $("#line0Add").hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
        $("#line0Add").click(function(){list.addNewColumn(true);});
        this.htmlRef = "#line0"
        this.lineID = "line0";
    }
    this.loadTitleLine =  function(cellsToAdd)
    {
        this.classId = 0;
        this.magicLineId = 0;
        var str ='<div id="line0">'
                    +'<input id="counterline0"; style="width:29px; border-right:0px solid #E6ECF1; border-bottom:1px solid white; margin-right:1px;  padding-right:0px; padding-left:0px;" class="cells0"; value=""; disabled>'
                    +'<span title="add new column" id="line0Add" style="cursor:pointer; color:#B6C4CF" class="icon-plus"></span>'
                +'</div>';
        $('#listBox').append(str);
        $("#line0Add").hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
        $("#line0Add").click(function(){list.addNewColumn(true);});
        this.htmlRef = "#line0"
        this.lineID = "line0";
        this.loadCells(cellsToAdd);
    }
    this.initLine = function(id, classId, lineBefore)
    {
        this.magicLineId = parseInt(id);
        this.classId = classId;
        id = "line"+id;
        var str ='<div id="'+ id +'">'
                    +'<input id="counter'+id+'"; style="border-top: 0px solid #E6ECF1; border-right:0px solid #E6ECF1; border-bottom:1px solid #7F93A3; margin-right:1px; width:29px; padding-right:0px; padding-left:0px;" class="cells0"; readonly>'
                    +'<span title="remove line" id="'+id+'Add" style="cursor:pointer;color:#B6C4CF" class="icon-close">'
                +'</span></div>';
        $(lineBefore).after(str);
        this.lineID = id;
        id='#'+id;
        this.htmlRef = id;
        id+="Add";
        $(id).hide();
        $(this.htmlRef).hover(function(){$(id).show();}, function(){$(id).hide();})
        $(id).hover(function(){$(id).css( "color", "#6CADEC" );}, function(){$(id).css( "color","#B6C4CF" );})
        var pt = this.lineID;
        $(id).click(function(){removeLine(pt); submitRemoveLineToWave();});
    }
    this.loadLine =  function(id, cellsToAdd, clID, lineBefore, magicId)
    {
        this.magicLineId = parseInt(magicId);
        this.classId = clID;
        var str ='<div id="'+ id +'">'
                    +'<input id="counter'+id+'"; style="border-top: 0px solid #E6ECF1; border-right:0px solid #E6ECF1; border-bottom:1px solid #7F93A3; margin-right:1px; width:29px; padding-right:0px; padding-left:0px;" class="cells0"; readonly>'
                    +'<span title="remove line" id="'+id+'Add" style="cursor:pointer;color:#B6C4CF" class="icon-close">'
                +'</span></div>';
        $(lineBefore).after(str);
        this.lineID = id;
        id='#'+id;
        this.htmlRef = id;
        id+="Add";
        $(id).hide();
        $(this.htmlRef).hover(function(){$(id).show();}, function(){$(id).hide();})
        $(id).hover(function(){$(id).css( "color", "#6CADEC" );}, function(){$(id).css( "color","#B6C4CF" );})
        var pt = this.lineID;
        $(id).click(function(){removeLine(pt); submitRemoveLineToWave();});
        this.loadCells(cellsToAdd);
    }
    this.addNewCell = function(id, idAfter)
    {
        var adderId = "";
        var num = this.cells.length;
        if (idAfter==null)
        {
            adderId = "#" + this.lineID + "Add";
            this.cells.push(new cellObject());
        }
        else
        {
            adderId = "#" + this.cells[idAfter].cellId;
            if (idAfter > 0)
                num = idAfter;
            else
                num = 0;
            this.cells.splice(num, new cellObject());
        }
        this.cells[num].init(id, adderId, this.classId, this.lineID);
    }
    this.loadCells = function(cellsToAdd)
    {
        for (var i=0; i < cellsToAdd.length; i++)
        {
            var id = this.cells.length;
            this.cells.push(new cellObject());
            var adderId = "#" + this.lineID + "Add";
            this.cells[this.cells.length-1].loadCell(cellsToAdd[i], adderId, this.classId, this.lineID);
        }
    }
    this.loadCell = function(cellToAdd)
    {
        var id = this.cells.length;
        this.cells.push(new cellObject());
        var adderId = "#" + this.lineID + "Add";
        this.cells[this.cells.length-1].loadCell(cellToAdd, adderId, this.classId, this.lineID);
    }
}
//______________________________________________________________________________
function cellObject(){
    // Variables
    // Methods
    this.styleClassId;
    this.columnId;
    this.cellId;
    this.text="";
    this.changed = false;
    this.init =  function(idC, addBefore, clId, lineId)
    {
        this.columnId = idC;
        this.styleClassId = clId;
        var classId = "cells" + clId;
        var idCell = lineId + "cell"+idC;
        var str ='<input type="text" class="'+classId+'" id="'+ idCell +'">';
        $(addBefore).before(str);
        this.cellId = idCell;
        idCell = "#" + idCell;
        var pt = this;
        adjustCellsWidth(this.columnId, this.text, "#"+ this.cellId);
        $(idCell).keyup(function(){
            pt.text = $(this).val(); 
            //console.log("Text->"+pt.text);
            pt.changed = true;
            var id = 0;
            for (var i=0; i < list.lines.length; i++)
            if (list.lines[i].lineID == lineId)
            {
                id = i;
                break;
            }
            adjustCellsWidth(pt.columnId, pt.text, "#"+ pt.cellId);
            submitCellToWave(list.lines[id].magicLineId, pt);
        });
        $(idCell).blur(function(){
            pt.changed = false;
            //submitCellToWave(list.lines[id].magicLineId ,pt);
        });
        var closerId = "#Closer_" + this.columnId;
        var sorterId = "#Sorter_" + this.columnId;
        $(idCell).mouseover(function(){
            $(closerId).show();
            $(sorterId).show();
            makeHiddenAllCollumnsButNotGivenOne(pt.columnId);
        });

    }
    this.loadCell = function(obj, addBefore, clId, lineId)
    {
        this.columnId = obj.columnId;
        this.styleClassId = clId;        
        var classId = "cells" + clId;
        var idCell = obj.cellId;
        var str ='<input type="text" class="'+classId+'" id="'+ idCell +'">';
        $(addBefore).before(str);
        updateGadgetWidth();
        this.cellId = idCell;
        idCell = "#" + idCell;
        var pt = this;
        this.text = obj.text;
        $(idCell).val(obj.text);
        adjustCellsWidth(this.columnId, this.text, "#"+ this.cellId);
        $(idCell).keyup(function(){
            pt.text = $(this).val(); 
            //console.log("Text->"+pt.text);
            pt.changed = true;
            var id = 0;
            for (var i=0; i < list.lines.length; i++)
            if (list.lines[i].lineID == lineId)
            {
                id = i;
                break;
            }
            adjustCellsWidth(pt.columnId, pt.text, "#"+ pt.cellId);
            submitCellToWave(list.lines[id].magicLineId ,pt);
        });
        $(idCell).blur(function(){
            pt.changed = false;
            //submitCellToWave(list.lines[id].magicLineId ,pt);
        });
        var closerId = "#Closer_" + this.columnId;
        var sorterId = "#Sorter_" + this.columnId;
        $(idCell).mouseover(function(){
            $(closerId).show();
            $(sorterId).show();
            makeHiddenAllCollumnsButNotGivenOne(pt.columnId);
        });
    }
    this.setClass = function(styleId){
        this.styleClassId = styleId;
        var classId = "cells" + styleId;
        var id = "#" + this.cellId;
        $(id).attr('class', classId);
    }
    this.setText = function(text){
        var idCell = this.cellId;
        idCell= "#" + idCell;
        this.text = text;
        $(idCell).val(text);
        adjustCellsWidth(this.columnId, this.text, "#"+ this.cellId);
    }
}