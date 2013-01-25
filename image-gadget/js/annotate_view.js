/*
 * annotate_view.js
 *
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Feb 2010 Eyal Zach (eyalzh@gmail.com) for everybodywave.net
 * modified for rizzoma.com by Robin Tibor Schirrmeister (robintibor@gmail.com)
 */
function AnnotateView(elemSel) {
    this.elem = $(elemSel);
}

AnnotateView.prototype.draw = function (annot)
{
	var uid = annot.getUniqueKey();
	var res = $(this.elem)
		.append("<div class='annot-out' id='an"+uid+"'><div class='annot-in' aid='"+uid+"'></div></div><div class='annot-text' id='ant"+uid+"'></div>")
		.find("#an"+uid)
			.css("top",annot.y)
			.css("left",annot.x)
			.find(":only-child")
				.css("width",annot.width)
				.css("height",annot.height)
				.hover(function () {$("#ant"+$(this).attr("aid")).fadeIn(100)}, function () {$("#ant"+$(this).attr("aid")).fadeOut(100)});
	var annotText = annot.caption || "[no text]";
	var annotTextEsc = annotText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	if (annotTextEsc.charAt(0) == "@") {
		var part = wave.getParticipantById(annotTextEsc.substring(1));
		if (part) {
			annotTextEsc = "<img src='"+part.getThumbnailUrl()+"' width='30' height='30'> <span style='font-style:italic'>"+part.getDisplayName()+"</span>";
		}
	} else if (annotTextEsc.charAt(0) == "#") {
		$(res).css("border","0").append("<span class='lolcat' aid='"+uid+"' unselectable='on'></span>").find("span").text(annotTextEsc.substring(1));
		$(res).parent().css("border","0");
	} else if (annotTextEsc.substring(0,5) == "!http") {
		$(res).css("border","0").css("background","url('"+annotTextEsc.substring(1)+"') no-repeat left top");
    $(res).parent().css("border","0");
	}
	var antX,antY;
	if (annot.y+annot.height > parseInt($(this.elem).find("img").attr("height")) - 50) {
		antX = annot.x+annot.width+5;
		antY = annot.y;
	} else {
		antX = annot.x;
		antY = annot.y+annot.height+5;	
	}
	var pWaveUser=wave.getParticipantById(annot.creatorName);
	var pName=pWaveUser?pWaveUser.getDisplayName():annot.creatorName;
	$("#ant"+uid)
		.css("top",antY)
		.css("left",antX)
		.html(annotTextEsc+"<br/><small>Created by "+pName+"</small>");
	
	return res;
}

AnnotateView.prototype.addEditControl = function (annot)
{
	$(this.elem).append("<div class='annot-edit' id='an-edit"+annot.getUniqueKey()+"'></div>");
	this.makeEditable(annot);
}

AnnotateView.prototype.makeEditable = function (annot)
{
	var uid = annot.getUniqueKey();
	$("#an"+uid).hide();
	$("#an-edit"+uid)
		.css("top",annot.y + 'px')
		.css("left",annot.x + 'px')
		.css("width",annot.width + 'px')
		.css("height",annot.height + 'px')
		.resizable({ 
			containment: 'parent', 
			minWidth: 10, minHeight: 10,
			resize: function () {_posFormEvent($(this))}
		})
		.draggable({
			containment: 'parent',
			drag: function () {_posFormEvent($(this))}
		});
	_posFormEvent($("#an-edit"+uid));
}

AnnotateView.prototype.cancelEditControl = function () 
{
	$(".annot-edit").remove();
}

AnnotateView.prototype.finalizeEdit = function (annot)
{
	var ae = $("#an-edit"+annot.getUniqueKey());
	annot.y = parseInt($(ae).css("top"));
	annot.x = parseInt($(ae).css("left"));
	annot.width = parseInt($(ae).css("width"));
	annot.height = parseInt($(ae).css("height"));
	$(".annot-edit").remove();
	return this.draw(annot);
}

AnnotateView.prototype.showall = function (isPlayback)
{
	$(".annot-out").show();
	if (isPlayback) 
		$(".annot-text").show();
}

AnnotateView.prototype.hideall = function ()
{
	$(".annot-out").hide();
}

AnnotateView.prototype.reset = function () {
	$(".annot-out").remove();
	$(".annot-text").remove();
}

// Static
function _posFormEvent(t) {
	$("#annotform")
		.show()
		.css('left', $(t).offset().left + 'px')
		.css('top', (parseInt($(t).offset().top) + parseInt($(t).height()) + 3) + 'px');	
}