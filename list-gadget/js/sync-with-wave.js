function saveLinesToWave(){
    var linesString, listString;
    //alert($("#listBox").html());
    //linesString = $("#listBox").html();
    listString = JSON.stringify(list);
    //this.wave.getState().submitValue("linesHTML", linesString);
    //console.log(list);
    //console.log("subbmit!");
    this.wave.getState().submitValue("listObj", listString);
}
function loadListBox()
{
    var html, listString;
    html = wave.getState().get("linesHTML");
    listString = wave.getState().get("listObj");
    var listNew = JSON.parse(listString);
    //console.log(listNew);
    //console.log(list);
    //alert("Stop");
    if (listNew !== null)
    {
        //console.log("idOld->"+list.lineMagicID);
        //console.log("idNew->"+listNew.lineMagicID);
        // check for removed lines
        if (listNew.lines.length < list.lines.length)
        {
            var j = 0;
            while (j < listNew.lines.length 
                && listNew.lines.length < list.lines.length)
            {
                 if (listNew.lines[j].lineID != list.lines[j].lineID)
                    removeLine(list.lines[j].lineID);
                 else
                    j++;
            }
            while  (listNew.lines.length < list.lines.length)
            {
                 removeLine(list.lines[list.lines.length - 1].lineID);
            }
        }
        // check for removed collumns
        if (list.lines.length > 0 
            && listNew.lines[0].cells.length < list.lines[0].cells.length)
        {
            var j = 0;
            while (j < listNew.lines[0].cells.length 
                && listNew.lines[0].cells.length < list.lines[0].cells.length)
            {
                 if (listNew.lines[0].cells[j].columnId != list.lines[0].cells[j].columnId)
                    removeGivenCollumn(list.lines[0].cells[j].columnId);
                else
                    j++;
            }
            while  (listNew.lines[0].cells.length < list.lines[0].cells.length)
            {
                 removeGivenCollumn(list.lines[0].cells[list.lines[0].cells.length-1].columnId);
            }
        }
        // check for new collumns
        if (list.lines.length > 0 
            && listNew.lines[0].cells.length > list.lines[0].cells.length)
        {
            var begin = list.lines[0].cells.length;
            for (var i=0; i < listNew.lines.length; i++)
            {
                for (var j=begin; j < listNew.lines[i].cells.length; j++)
                {
                    list.lines[i].loadCell(listNew.lines[i].cells[j]);
                }
            }
            updateGadgetWidth();
        }
        // check for new lines
        if (listNew.lines.length > list.lines.length)
        {
            var j = list.lines.length;
            while (j < listNew.lines.length)
            {
                 list.loadLine(listNew.lines[j].lineID, listNew.lines[j].cells, listNew.lines[j].magicLineId);
                 j++;
            }
            
        }
        list.lineMagicID = listNew.lineMagicID;
        list.collumnMagicID = listNew.collumnMagicID;
        // check for new Entrys
        for (var i=0; i < listNew.lines.length; i++)
        {
            var classIdNum  =  ((i + 1) % 2) + 1;
            if (i == 0) classIdNum = 0;
            for (var j=0; j < listNew.lines[i].cells.length; j++)
            {
                if (listNew.lines[i].cells[j].text != list.lines[i].cells[j].text 
                    && list.lines[i].cells[j].changed == false)
                {
                    list.lines[i].cells[j].setText(listNew.lines[i].cells[j].text);
                    //var id = "#" + list.lines[i].cells[j].cellId;
                    //$(id).val(list.lines[i].cells[j].text);
                }
                if (classIdNum != list.lines[i].cells[j].styleClassId)
                {
                    list.lines[i].cells[j].setClass(classIdNum);
                }
                adjustCellsWidth(list.lines[i].cells[j].columnId, list.lines[i].cells[j].text, "#"+list.lines[i].cells[j].cellId);
            }
        }
        drawIconsForEachCollumn();
        updateId()
    }
    else
    {
        list.addNewLine(false);
        list.addNewLine(false);
        updateId()
    }
    //console.log(list);
}
wave.setStateCallback(loadListBox);
