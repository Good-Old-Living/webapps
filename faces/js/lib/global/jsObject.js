var jsObject = {

	getAttrValue : function(object, name) {

		if (!sys.isValid(object) || !sys.isValid(name)) {
			return null;
		}

		var val = null;
		var i = name.indexOf(".");
		if (i > 0) {
			var pname = name.substring(0, i);
			var cname = name.substring(i + 1);

			val = this.getAttrValue(object[pname], cname);
		} else {
			val = object[name];
		}

		if (!sys.isValid(val)) {
			return null;
		}

		return val;
	},

	wrap : function(parent, obj) {
		var res = {};
		res[parent] = obj;
		return res;
	},

	flatten : function(object) {
		if (!sys.isValid(object)) {
			return null;
		}

		return this.flattenChild(object, null, object);
	},

	flattenChild : function(orgObject, attr, object) {

		var flattenKey = "";

		for ( var attrKey in object) {
			if (attr == null) {
				flattenKey = attrKey;
			} else {
				flattenKey = attr + "." + attrKey;
			}

			if (sys.isObjectType(object[attrKey])) {
				this.flattenChild(orgObject, flattenKey, object[attrKey]);
			} else {
				orgObject[flattenKey] = object[attrKey];
			}

		}
		return orgObject;
	}
};