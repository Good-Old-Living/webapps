ui.init_tabs = function(node) {
	return new UITabs(node);
}

function UITabs(nd) {
	this.ul = nd.getElementsByTagName("ul")[0];
	UIComp.call(this, nd);
}

UITabs.prototype = new UIComp();

UITabs.prototype.init = function() {
	$("li", $(this.ul)).each(function() {
		this.onclick = function(e) {
			this.parentNode.parentNode.uiComp.selectTab(this);
		}
	});

	var binds = this.node.getAttribute("binds");
	if (binds) {
		var ln = binds + "-Tabs";
		var eAdd = EntityEventName.add(binds);
		var addCB = function(ae) {
			this.source.selectFirstTab(true);
		}
		eventQueue.listener(eAdd, new AppEventListener(ln, addCB, this));
		
		var eRm = EntityEventName.removed(binds);
		var rmCB = function(ae) {
			this.source.hide();
		}
		eventQueue.listener(eRm, new AppEventListener(ln, rmCB, this));

		var eSet = EntityEventName.set(binds);
		var setCB = function(ae) {
			var e = this.source.selectFirstTab(false);
		}
		eventQueue.listener(eSet, new AppEventListener(ln, setCB, this));
	}
};

UITabs.prototype.selectFirstTab = function(hideOthers) {
	this.selectTab($("li", $(this.ul))[0], hideOthers);
}

UITabs.prototype.selectTab = function(tab, hideOthers) {
	tab = $(tab);
	tab.siblings().attr("class", "tab");
	$('a', tab.siblings()).attr("class", "null");
	$("a", tab).attr("class", "sel");
	tab.attr("class", "tab sel");
	if (hideOthers != undefined )
		this.hideOthers(tab, hideOthers);
	$(".tci-" + tab.parent().parent().attr("id")).css("display", "none");
	$('#tc-' + tab.attr("id")).css("display", "");
};

UITabs.prototype.hide = function() {
	$("li", $(this.ul)).hide();
}

UITabs.prototype.hideOthers = function(tab, hide) {
	tab = $(tab);
	tab.siblings().css("display", (hide) ? "none" : "");
	$("div[binds]", $(".tci-" + tab.parent().parent().attr("id"))).css("display", "none");
}