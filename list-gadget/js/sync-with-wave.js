function submitSortToWave(sortState, columnToSort)
{
    // actions
    // 5: sort
    var lines = new Array();
    for (var i=0; i < list.lines.length; i++)
    {
        lines.push(list.lines[i].magicLineId);
    }
    var linesString;
    linesString = JSON.stringify(lines);
    var delta = {};
    delta["lines"] = linesString;
    delta["sortState"] = sortState;
    delta["action"] = 5;
    delta["cToSort"] = columnToSort;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}
function submitNewLineToWave()
{
    // actions
    // 1: addLine
    var lines = new Array();
    for (var i=0; i < list.lines.length; i++)
    {
        lines.push(list.lines[i].magicLineId);
    }
    var linesString;
    linesString = JSON.stringify(lines);
    var delta = {};
    delta["lines"] = linesString;
    delta["action"] = 1;
    delta["lineMagicID"] = list.lineMagicID;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}

function submitRemoveLineToWave()
{
    // actions
    // -1: removLine
    var lines = new Array();
    for (var i=0; i < list.lines.length; i++)
    {
        lines.push(list.lines[i].magicLineId);
    }
    var linesString;
    linesString = JSON.stringify(lines);
    var delta = {};
    delta["lines"] = linesString;
    delta["action"] = -1;
    delta["lineMagicID"] = list.lineMagicID;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}

function submitNewColumnToWave()
{
    // actions
    // 2: addColumn
    var lines = new Array();
    for (var i=0; i < list.lines[0].cells.length; i++)
    {
        lines.push(list.lines[0].cells[i].columnId);
        //console.log(list.lines[0].cells[i]);
    }
    var columnString;
    columnString = JSON.stringify(lines);
    var delta = {};
    delta["columns"] = columnString;
    delta["action"] = 2;
    delta["collumnMagicID"] = list.collumnMagicID;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}

function submitRemoveColumnToWave()
{
    // actions
    // -2: removeColumn
    var lines = new Array();
    for (var i=0; i < list.lines[0].cells.length; i++)
    {
        lines.push(list.lines[0].cells[i].columnId);
        //console.log(list.lines[0].cells[i]);
    }
    var columnString;
    columnString = JSON.stringify(lines);
    var delta = {};
    delta["columns"] = columnString;
    delta["action"] = -2;
    delta["collumnMagicID"] = list.collumnMagicID;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}

function submitCellToWave(lineId, cell)
{
    // actions
    // 0: text in Cell was changed 
    var cellId = lineId + "_" + cell.columnId;
    var delta = {};
    delta[cellId] = JSON.stringify(cell);
    delta["action"] = 0;
    delta["y"] = lineId;
    delta["x"] = cell.columnId;
    console.log("PaketSize:" + JSON.stringify(delta).length + " " + JSON.stringify(delta));
    this.wave.getState().submitDelta(delta);
}
function loadGadget()
{
    var state = wave.getState();
    var lines = JSON.parse(state.get("lines"));
    var columns = JSON.parse(state.get("columns"));
    if (lines !== null)
    {
        list.linesOrder = lines;
        if (columns !== null)
            list.columnsOrder = columns;
        list.lineMagicID = state.get("lineMagicID");
        list.collumnMagicID = state.get("collumnMagicID");
        for (var i=0; i < lines.length; i++)
        {
            var cells = new Array();
            for (var j = 0; j < columns.length; j++)
            {
                var cId = lines[i]+"_"+columns[j];
                var cell = JSON.parse(state.get(cId));
                if (cell !== null) 
                {
                    cells.push(cell);
                    cells[cells.length-1].columnId = columns[j];
                }
                else
                {
                    cells.push(new cellObject());
                    cells[cells.length-1].columnId = columns[j];
                    cells[cells.length-1].cellId = "line"+lines[i]+"cell"+columns[j];
                    cells[cells.length-1].text = "";
                }
            }
            list.loadLine("line" + lines[i], cells, lines[i], null);
        }
        updateGadgetWidth();
    } else
    {
        list.addNewLine(true);
        list.addNewLine(true);
        updateId()
    }
}
function updateGadget()
{
    if (list.lineMagicID == 0)
    {
        loadGadget();
    } else
    {
        var state = wave.getState();
        var action = parseInt(state.get('action')); 
        var lineIds = JSON.parse(state.get('lines'));
        var columnIds = JSON.parse(state.get('columns'));
        if (list.lines[0].cells.length != columnIds.length 
            || list.collumnMagicID != state.get("collumnMagicID"))
        {
            var mapColumnNew = {};
            for (var i=0; i < columnIds.length; i++)
                mapColumnNew[columnIds[i]]=1;
            var mapColumnOld = {};
            for (var i=0; i < list.lines[0].cells.length; i++)
                mapColumnOld[list.lines[0].cells[i].columnId]=1;
            // remove Columns
            var id = 0; 
            while (id < list.lines[0].cells.length)
            {
                if (!(list.lines[0].cells[id].columnId in mapColumnNew))
                {
                    removeGivenCollumn(list.lines[0].cells[id].columnId);
                } else
                {
                    id++;
                }
            }
            // add columns
            if (list.lines[0].cells.length != columnIds.length)
            {
                for (var i=0; i < columnIds.length; i++)
                {
                    if (!(columnIds[i] in mapColumnOld))
                    {
                        if (i > 0)
                        {
                            var indexAfter = -1;
                            for (var k=0; k < list.lines[0].cells.length-1; k++)
                                if (list.lines[0].cells[k].columnId == columnIds[i-1])
                                {
                                    indexAfter = k+1;
                                    break;
                                }
                            if (indexAfter > 0)
                                list.insertColumn(columnIds[i], indexAfter);
                            else
                                list.insertColumn(columnIds[i], null);
                        }
                        else
                            list.insertColumn(columnIds[i], 0);
                    }
                }
            }
        }
        if (lineIds!=null && (list.lines.length != lineIds.length 
            || list.lineMagicID != state.get("lineMagicID")))
        {
            var mapLinesNew = {};
            for (var i=0; i < lineIds.length; i++)
                mapLinesNew[lineIds[i]]=1;
            var mapLinesOld = {};
            for (var i=0; i < list.lines.length; i++)
                mapLinesOld[list.lines[i].magicLineId]=1;
            // remove Lines
            var id = 0; 
            while (id < list.lines.length)
            {
                if (!(list.lines[id].magicLineId in mapLinesNew))
                {
                    removeLine(list.lines[id].lineID)
                } else
                {
                    id++;
                }
            }
            // add Lines
            if (list.lines.length != lineIds.length)
            {
                for (var i=0; i < lineIds.length; i++)
                {
                    if (!(lineIds[i] in mapLinesOld))
                    {
                        var cells = new Array();
                        for (var j = 0; j < columnIds.length; j++)
                        {
                            var cId = lineIds[i]+"_"+columnIds[j];
                            var cell = JSON.parse(state.get(cId));
                            if (cell !== null) 
                            {
                                cells.push(cell);
                                cells[cells.length-1].columnId = columnIds[j];
                            }
                            else
                            {
                                cells.push(new cellObject());
                                cells[cells.length-1].columnId = columnIds[j];
                                cells[cells.length-1].cellId = "line"+lineIds[i]+"cell"+columnIds[j];
                                cells[cells.length-1].text = "";
                            }
                        }
                        var idBefore = "";
                        var index = 0;
                        for (var k = 0; k < list.lines.length-1; k++)
                            if (i > 0 && list.lines[k].magicLineId == lineIds[i-1])
                            {
                                idBefore = "#"+list.lines[k].lineID;
                                index = k+1;
                                break;
                            }
                        if (idBefore.length > 0)
                            list.loadLine("line" + lineIds[i], cells, lineIds[i], idBefore, index);
                        else
                            list.loadLine("line" + lineIds[i], cells, lineIds[i], null, null);
                    }
                }
            }
        }
        /*if(action == 0) // new text-entry
        {
            var lineId = state.get("y");
            var columnId = state.get("x");
            var cellId = lineId+"_"+columnId;
            var cell = JSON.parse(state.get(cellId));
            var yId = 0;
            var xId = 0;
            for (var i=0; i < list.lines.length; i++)
                if (list.lines[i].magicLineId == lineId)
                {
                    yId = i;
                    break;
                }
            for (var i=0; i < list.lines[0].cells.length; i++)
                if (list.lines[0].cells[i].columnId == columnId)
                {
                    xId = i;
                    break;
                }
            list.lines[yId].cells[xId].setText(cell.text);
            adjustCellsWidth(list.lines[yId].cells[xId].columnId,
                             list.lines[yId].cells[xId].text, 
                             "#"+ list.lines[yId].cells[xId].cellId);
            updateGadgetWidth();                             
        } else */ if (action == 5) // sort
        {
            var sortState = parseInt(state.get("sortState"));
            var cToSort = state.get("cToSort");
            switch (sortState) {
                case 0: sortGivenCollumn(-1, true); break; //back to insertion order
                case 1: sortGivenCollumn(cToSort, true); break; //ascending
                case 2: sortGivenCollumn(cToSort, false); break; //desending
                default: console.log('bad sort command came from wave');
            }
        }
        
        for (var i=0; i < list.lines.length; i++)
        {
            var lId = list.lines[i].magicLineId;
            var cellClass = (((i+1) % 2) + 1);
            list.lines[i].classId = cellClass;
            for (var j=0; j < list.lines[i].cells.length; j++)
            {
                var cId = list.lines[i].cells[j].columnId;
                var cellId = lId+"_"+cId;
                var cell = JSON.parse(state.get(cellId));
                if (cell !== null) 
                {
                    if (list.lines[i].cells[j].changed == false)
                        list.lines[i].cells[j].setText(cell.text);
                    //else
                    //    list.lines[i].cells[j].changed = false;
                }
                if (i>0)
                    list.lines[i].cells[j].setClass(cellClass);
                else
                    list.lines[i].cells[j].setClass(0);
            }
        }
        list.lineMagicID = state.get("lineMagicID");
        list.collumnMagicID = state.get("collumnMagicID");
    }
    drawIconsForEachCollumn();
    updateId();
}