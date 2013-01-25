/*
 * annotate_model.js
 *
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
 * Feb 2010 Eyal Zach (eyalzh@gmail.com) for everybodywave.net
 * modified for rizzoma.com by Robin Tibor Schirrmeister (robintibor@gmail.com)
 */
 
function AnnotateModel() {
    this.nextId = 0;
	this.data = {};
	this.userid = wave.getViewer().getId().split("@")[0].replace(/[\.\-_]/g,'_');
}

AnnotateModel.prototype.create = function() {
	this.nextId++;
	var an = new Annotation(this.nextId, this.userid);
	return an;
}

AnnotateModel.prototype.save = function(annot) {
	this.data[annot.getUniqueKey()] = annot.toJSON();
}

AnnotateModel.prototype.remove = function(annot) {
	var keyToRemove = annot.getUniqueKey();
	this.data[keyToRemove] = null;
	wave.getState().submitValue(keyToRemove,null);
}

AnnotateModel.prototype.isChanged = function(annot) {
	var e = this.data[annot.getUniqueKey()];
	return !e || annot.x != e.x || annot.y != e.y || annot.width != e.w || annot.height != e.h || annot.caption != e.cp;
}

AnnotateModel.prototype.getAnnotationByKey = function (key) {
	var keyVals = key.split("-");
	var an = new Annotation(keyVals[1],keyVals[2]);
	an.fromJSON(this.data[key]);
	return an;
}

AnnotateModel.prototype.loadFromWave = function() {
	this.data = stateToAssocJson(wave.getState(), /an/);
	this.nextId = maxKeyIdx;
}

AnnotateModel.prototype.syncWithWave = function() {
	assocJsonToState(this.data, wave.getState());
}

AnnotateModel.prototype.reset = function () {
	this.nextId = 0;
	this.data = {};
}

AnnotateModel.prototype.iterate = function (eachCallback) {
	var an;
	for (key in this.data) {
		an = this.getAnnotationByKey(key);
		eachCallback(an);
	}
}

AnnotateModel.prototype.reposition = function (factorWidth, factorHeight)
{
	var e;
	for (key in this.data) {
		e = this.data[key];
		e.x = Math.round(e.x * factorWidth);
		e.y = Math.round(e.y * factorHeight);
		e.w = Math.round(e.w * factorWidth);
		e.h = Math.round(e.h * factorHeight);
	}
}

function Annotation(id, creatorId) {
	this.id=id;
	this.x = 0;
	this.y = 0;
	this.width = 20;
	this.height = 20;
	this.creatorId = creatorId;
	this.creatorName = null;
	this.caption = null;
	
	this.getUniqueKey = function () {
		return "an-"+this.id+"-"+this.creatorId.replace(/:/g,'_');
	}
	
	this.toJSON = function () {
		return {'x':this.x,'y':this.y,'w':this.width,'h':this.height,'cr':this.creatorName,'cp':this.caption};
	}
	
	this.fromJSON = function (json) {
		this.x = parseInt(json.x);
		this.y = parseInt(json.y);
		this.width = parseInt(json.w);
		this.height = parseInt(json.h);
		this.creatorName = json.cr;
		this.caption = json.cp;
	}
	
}

// Static:
var sortIndex = 0,
  k1v, k2v, maxIndex = 1,
  maxKeyIdx;

function stateOrder(k1, k2) {
  console.log("k1",wave.getState().get(k1));
  console.log("k2", wave.getState().get(k2));
  k1v = wave.getState().get(k1).split(" ")[sortIndex].split(":")[1];
  k2v = wave.getState().get(k2).split(" ")[sortIndex].split(":")[1];
  return k1v && k2v && parseInt(k1v) > parseInt(k2v) ? 1 : -1
}

function assocJsonToState(assoc, state) {
  var d = {}, kv, j;
  for (json in assoc) {
    kv = "";
    j = assoc[json];
    for (k in j) kv += " " + escape(k) + ":" + escape(j[k]);
    d[json] = kv.substring(1)
  };
  state.submitDelta(d)
}

function stateToAssocJson(state, re) {
  maxKeyIdx = 0;
  var a = {}, sks = state.getKeys(),
    sk, sv, jv, js, i, j, json, idx;
  sks.sort(stateOrder);
  for (j = 0; j < sks.length; j++) {
    sk = sks[j];
    if (sk.match(re)) {
      sv = state.get(sk);
      js = sv.split(" ");
      json = {};
      for (i = 0; i < js.length; i++) {
        jv = js[i].split(":");
        key = unescape(jv[0]);
        val = unescape(jv[1]);
        json[key] = val
      };
      a[sk] = json;
      idx = parseInt(sk.split("-")[maxIndex]);
      if (idx > maxKeyIdx) maxKeyIdx = idx
    }
  };
  return a
}