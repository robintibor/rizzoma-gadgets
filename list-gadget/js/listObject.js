//______________________________________________________________________________
function listObject(){
    // Variables
    this.lines = new Array();
    this.lineMagicID=0;
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
                this.lines[this.lines.length-1].addNewCell();
            if (saveToWave)
                saveLinesToWave();
        }
        else
        {
            this.lines[this.lines.length-1].initTitleLine();
            this.lines[this.lines.length-1].addNewCell();
        }
        gadgets.window.adjustHeight($('body').height());
    }
    // load line, that allready exist. For example by loading frome wave
    this.loadLine = function(lineId, cellsToLoad)
    {
        console.log("lId->"+lineId);
        this.lines.push(new lineObject());
        if (lineId == "line0")
        {
            this.lines[this.lines.length - 1].loadTitleLine(cellsToLoad);
        }
        else
        {
            var clId = (((this.lines.length) % 2) + 1);
            this.lines[this.lines.length-1].loadLine(lineId, cellsToLoad, clId, 
                                this.lines[this.lines.length-2].htmlRef);
        }            
        gadgets.window.adjustHeight($('body').height());
    }
    this.addNewColumn = function()
    {
        for (var i=0; i < this.lines.length; i++){
            this.lines[i].addNewCell();
        }
        saveLinesToWave();
        updateGadgetWidth();
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
    // Methods
    this.initTitleLine =  function()
    {
        this.classId = 0;
        var str ='<div id="line0"><span id="line0Add" style="cursor:pointer; color:#B6C4CF" class="icon-plus"></span></div>';
        $('#listBox').append(str);
        $("#line0Add").hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
        $("#line0Add").click(function(){list.addNewColumn();});
        this.htmlRef = "#line0"
        this.lineID = "line0";
    }
    this.loadTitleLine =  function(cellsToAdd)
    {
        this.classId = 0;
        var str ='<div id="line0"><span id="line0Add" style="cursor:pointer; color:#B6C4CF" class="icon-plus"></span></div>';
        $('#listBox').append(str);
        $("#line0Add").hover(function(){ $(this).css( "color", "#6CADEC" );}, function(){$(this).css( "color","#B6C4CF" );});
        $("#line0Add").click(function(){list.addNewColumn();});
        this.htmlRef = "#line0"
        this.lineID = "line0";
        this.loadCells(cellsToAdd);
    }
    this.initLine = function(id, classId, lineBefore)
    {
        this.classId = classId;
        id = "line"+id;
        var str ='<div id="'+ id +'"><span id="'+id+'Add" style="cursor:pointer;color:#B6C4CF" class="icon-close"></span></div>';
        $(lineBefore).after(str);
        this.lineID = id;
        id='#'+id;
        this.htmlRef = id;
        id+="Add";
        $(id).hide();
        $(this.htmlRef).hover(function(){$(id).show();}, function(){$(id).hide();})
        $(id).hover(function(){$(id).css( "color", "#6CADEC" );}, function(){$(id).css( "color","#B6C4CF" );})
        var pt = this.lineID;
        $(id).click(function(){removeLine(pt); saveLinesToWave();});
    }
    this.loadLine =  function(id, cellsToAdd, clID, lineBefore)
    {
        this.classId = clID;
        var str ='<div id="'+ id +'"><span id="'+id+'Add" style="cursor:pointer;color:#B6C4CF" class="icon-close"></span></div>';
        $(lineBefore).after(str);
        this.lineID = id;
        id='#'+id;
        this.htmlRef = id;
        id+="Add";
        $(id).hide();
        $(this.htmlRef).hover(function(){$(id).show();}, function(){$(id).hide();})
        $(id).hover(function(){$(id).css( "color", "#6CADEC" );}, function(){$(id).css( "color","#B6C4CF" );})
        var pt = this.lineID;
        $(id).click(function(){removeLine(pt); saveLinesToWave();});
        this.loadCells(cellsToAdd);
    }
    this.addNewCell = function()
    {
        var id = this.cells.length;
        this.cells.push(new cellObject());
        var adderId = "#" + this.lineID + "Add";
        this.cells[id].init(id, adderId, this.classId, this.lineID);
    }
    this.loadCells = function(cellsToAdd)
    {
        for (var i=0; i < cellsToAdd.length; i++)
        {
            var id = this.cells.length;
            this.cells.push(new cellObject());
            var adderId = "#" + this.lineID + "Add";
            this.cells[this.cells.length-1].loadCell(cellsToAdd[i], adderId, this.classId);
        }
    }
    this.loadCell = function(cellToAdd)
    {
        var id = this.cells.length;
        this.cells.push(new cellObject());
        var adderId = "#" + this.lineID + "Add";
        this.cells[this.cells.length-1].loadCell(cellToAdd, adderId, this.classId);
    }
}
//______________________________________________________________________________
function cellObject(){
    // Variables
    // Methods
    this.styleClassId;
    this.cellId;
    this.text="";
    this.changed = false;
    this.init =  function(idC, addBefore, clId, lineId)
    {
        this.styleClassId = clId;
        var classId = "cells" + clId;
        var idCell = lineId + "cell"+idC;
        var str ='<input type="text" class="'+classId+'" id="'+ idCell +'">';
        $(addBefore).before(str);
        this.cellId = idCell;
        idCell = "#" + idCell;
        var pt = this;
        $(idCell).keyup(function(){
            pt.text = $(this).val(); 
            console.log("Text->"+pt.text);
            saveLinesToWave();
            pt.changed = true;
        });
//        $(idCell).hover(function(){$(idCell).css( "background-color", "#6CADEC" );}, function(){$(idCell).css( "background-color","" );})

    }
    this.loadCell = function(obj, addBefore, clId)
    {
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
        $(idCell).keyup(function(){
            pt.text = $(this).val(); 
            console.log("Text->"+pt.text);
            pt.changed = true;
            saveLinesToWave();
        });
        $(idCell).blur(function(){
            pt.changed = false;
            saveLinesToWave();
        });
    }
    this.setClass = function(styleId){
        this.styleClassId = styleId;
        var classId = "cells" + styleId;
        var id = "#" + this.cellId;
        $(id).attr('class', classId);
    }
}