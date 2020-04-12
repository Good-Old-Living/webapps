(function() {

	document.getBody = function() {
		return $("body")[0];
	},

	document.nodeExists = function(nodeId) {
		return sys.isValid(this.getElementById(nodeId));
	},

	document.appendHTML = function(html, parentNd) {
		if (parentNd) {
			if (typeof parentNd == 'string') {
				parentNd = $('#' + parentNd);
			} else
				$(parentNd).append(html);
		} else {
			$("body").append(html);
		}
	},
	
	document.gparent = function(node, parentName) {
		var pn = node;
		while ((pn = pn.parentNode) != null) {

			if (pn.nodeName == parentName) {

				return pn;
			}
		}

		return null;
	},
	
	document.eachInput = function(node, callback, uo) {
		this.eachInputType(node, "input", callback, uo);
		this.eachInputType(node, "select", callback, uo);
		this.eachInputType(node, "textarea", callback, uo);
	},

	document.eachInputType = function(node, type, callback, uo) {

		var inps = node.getElementsByTagName(type)
		for (var i = 0, inp; inp = inps[i++];) {
			callback(inp, uo);
		}
	},
	
	document.focusFirstInput = function(node) {
		
		var c = node.getElementsByTagName("input");
        
        if (c && c.length > 0) {
        	for (var i=0, e; e=c[i++];) {
        	  t = e.getAttribute("type");
        	  if (t == 'null' || t == 'text') {
        		  e.focus();
        		  break;
        	  }
        	} 
        }
		
	}
})();