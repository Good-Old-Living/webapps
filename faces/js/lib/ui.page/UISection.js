ui.page.section = (function() {

	var SN = {};
	// var seq = 0;

	function loadXHtml(url, nd, mode) {
		if (!url.startsWith("/"))
			url = APP_HOME + url;
		var h;
		
		try {
		  h = webServer.get(url);
		} catch (e) {
			return;
		}
		h = $.parseHTML(h.trim(), null, true);
		
		var p;
		var n;

		if (!nd) {
			nd = $("body")[0];
		}

		if (typeof nd == 'string') {
			p = $("#" + nd);
			n = document.getElementById(nd);
		} else {
			p = $(nd);
			n = nd;
		}

		if (mode == 'A')
			$(h).appendTo(p);
		else
			p.html(h);
		xhtmlParser.parse(n);
		return h[0];
	}

	SN.attachXHtml = function(url, nd) {
		return loadXHtml(url, nd, 'R');
	}

	SN.appendXHtml = function(url, nd) {
		return loadXHtml(url, nd, 'A');
	}

	/*
	 * WR.loadTab = function(title, node) { var div =
	 * document.getFirstChild(node, "DIV"); scrollNd =
	 * document.getFirstChild(div, "DIV");
	 * 
	 * ul = document.getFirstChild(div, "UL"); ul.fvLi =
	 * document.getFirstChild(ul, "LI"); ul.ml = 0;
	 * 
	 * scrollRegd(); window.onWindowResize(scrollRegd); attachHandlers(); };
	 * 
	 * WR.addTab = function(title, url) { $(ul).append("<li>" + title + "</li>"); };
	 * 
	 * function scrollRegd() { scrollNd.style.display =
	 * window.exceedsWindowWidth(ul) ? "block" : "none"; }
	 * 
	 * function attachHandlers() { document.eachChildElement(scrollNd,
	 * function(node) { if (node.className == "left") { node.onclick =
	 * function() { var sib = document.nxtSibling(ul.fvLi, "LI"); if (sib !=
	 * null) { ul.ml -= ul.fvLi.offsetWidth; ul.style.marginLeft = ul.ml+ "px"
	 * ul.fvLi = sib; } } } else if (node.className == "right") { node.onclick =
	 * function() {
	 * 
	 * var sib = document.prevSibling(ul.fvLi, "LI"); if (sib != null) { ul.fvLi =
	 * sib; ul.ml += sib.offsetWidth; ul.style.marginLeft = ul.ml+"px"; } } }
	 * else if (node.className == "drop") {
	 * 
	 * node.onclick = function() { var dul = "<ul>";
	 * document.eachChildElement(ul, function(li) {
	 * 
	 * dul += "<li>"+document.nodValue(li)+"</li>"
	 * 
	 * 
	 * }); dul += "</ul>";
	 *  } } }); }
	 */

	return SN;

})();