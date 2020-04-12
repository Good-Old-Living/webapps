var varHeap = (function() {

	var VH = function() {
		this.varMap = {};
	};

	VH.prototype.clear = function() {
		this.varMap = {};
	};

	VH.prototype.get = function(name) {

		if (name.indexOf(".") != -1) 
			return jsObject.getAttrValue(this.varMap, name);
		return this.varMap[name];
	};

	VH.prototype.set = function(name, value) {
		this.varMap[name] = value;
		var e = new AppEvent(EntityEventName.set(name), value);
		eventQueue.fire(e);
	};

	VH.prototype.print = function() {
		sys.print(this.varMap);
	};

	return new VH();
})();
