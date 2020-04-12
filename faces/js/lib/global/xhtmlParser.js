var xhtmlParser = {
	onParseFns : [],

	callAfterParse : function(fn, uo) {
		this.onParseFns.push([ fn, uo ]);
	},

	parse : function(node) {

		this.parseRecursive(node);

		var tas = $(".ckeditor", node);

		if (tas) {
			for (var i = 0, ta; ta = tas[i++];) {
				CKEDITOR.replace(ta.getAttribute("id"));
			}
		}

		for (var i = 0, fn; fn = this.onParseFns[i++];) {
			fn[0](fn[1]);
		}
	},

	parseRecursive : function(node) {

		var nds = node.childNodes;
		for (var i = 0, nd; nd = nds[i++];) {

			if (nd.nodeType == 1) {
				var cn = nd.getAttribute("c");

				if (cn) {

					try {
						if (eval("typeof ui.init_" + cn) == "function") {
							var comp = eval("ui.init_" + cn + "(nd)");
							nd.uiComp = comp;
						} else {
							var bs = nd.getAttribute("binds");
							if (bs) eval("ui.init_comp(nd)");
						}
					} catch (e) {
						sys.log(cn+" : "+e);
					}

				}

				this.parseRecursive(nd);
			}
		}
	}
};