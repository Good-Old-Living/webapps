var VAR_START = "#{";
var VAR_END = "}";

var el = {

	isVar : function(str) {
		if (!sys.isValid(str))
			return false;
		return (typeof str == 'string' && str.indexOf(VAR_START) == 0 && str
				.lastIndexOf(VAR_END) == str.length - 1);
	},

	containsVar : function(str) {

		if (typeof str != 'string') {
			return false;
		}

		return str.encompasses(VAR_START, VAR_END);
	},

	getFirstVar : function(str) {

		if (!this.containsVar(str)) {
			return str;
		}

		var si = str.indexOf(VAR_START);
		var ei = str.indexOf(VAR_END) + 1;

		return str.substring(si, ei);
	},

	getVarName : function(variable) {
		if (!this.isVar(variable))
			return null;
		var si = VAR_START.length;
		var ei = variable.length - 1;
		return variable.substring(si, ei);
	},

	getVarNames : function(str) {
		var va = new Array();
		this.addVarNames(str, va);
		return va;
	},
	
	addVarNames : function(str, va) {
		if (!this.containsVar(str)) {
			return;
		}

		var name = this.getFirstVar(str);
		name = this.getVarName(name);
		va.push(name);
		var ei = str.indexOf(VAR_END) + 1;

		return this.addVarNames(str.substring(ei), va);
	},
	
	getVarValue : function(varName, object, useVar) {

		var value;
		if (this.isVar(varName)) {
			varName = this.getVarName(varName);
		}

		var i = varName.indexOf(".");
		if (i >= 0) {
			var parent = varName.substring(0, i);
			varName = varName.substring(i + 1);

			if (sys.isValid(object))
				object = object[parent];
			else object = varHeap.get(parent);  
			if (sys.isValid(object))
				return this.getVarValue(varName, object);
		} else {
			if (sys.isValid(object))
				return object[varName];
		}

		return null;
	},

	getVarExceptLastPart : function(str) {
		var v = this.getVarName(str);
		return v.substring(0, v.lastIndexOf("."));
	},

	getVarLastPart : function(str) {
		var v = this.getVarName(str);
		return v.substring(v.lastIndexOf(".")+1);
	},
	
	substitute : function(str, object, ignore) {
		if (!this.containsVar(str)) {
			return str;
		}

		var variable = this.getFirstVar(str);
		var value = this.getVarValue(variable, object);

		if (!sys.isValid(value)) {
			if (ignore)
				value = "";
			else
				throw ("No value for " + variable);
		}

		str = str.replace(variable, value);

		return this.substitute(str, object, ignore);
	}
};