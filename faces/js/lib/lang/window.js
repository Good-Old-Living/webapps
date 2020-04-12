(function() {
	window.fns = [];
	window.rsfns = [];
	
	
	
	function setInWidth() {
		window.inWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}
	
	window.queryParams = function() {

		var loc = window.location.href;

		var index = loc.indexOf("?");
		if (index == -1) {
			return {};
		}

		var query = loc.substring(index + 1);

		return query.toProperties('&', '=');
	}

	window.queryParam = function(name) {
		return this.queryParams()[name];
	}

	window.setCookie = function(name, value, options) {
		$.cookie(name, value, {
			expires : 1,
			path : "/"
		});
	}

	window.unsetCookie = function(name) {
		$.cookie(name, "", {
			path : "/"
		});
	}

	window.getCookie = function(name) {
		var cookie = $.cookie(name);
		return cookie && cookie != "" ? cookie : null;
	}

	window.exceedsWidth = function(node) {
		//alert(this.inWidth+" "+node.scrollWidth+" "+node.clientTop+" "+node.offsetTop);
		return node.scrollWidth > this.inWidth;
	}

	window.callOnResize = function(fn) {
		this.rsfns.push(fn);
	}
	
	window.callOnLoad = function(fn) {
		this.fns.push(fn);
	}
	
	window.onResize = function() {
		callFns(this.rsfns);
	}
	
	function callFns(fns) {
		
		for (var i = 0, fn; fn = fns[i++];) {
			fn();
		}
		fns = [];
	}
	
	window.onload = function() {
		setInWidth();
		callOnResize(setInWidth);
		callFns(this.fns);
	}

})();