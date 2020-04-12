ui.init_entityList = function(node) {

	return new UIList(node);
}

function UIList(nd) {
	this.items = $("li", $(nd));
	UIComp.call(this, nd);
};

UIList.prototype = new UIComp();

UIList.prototype.init = function() {

	this.items.each(function() {
		this.onclick = function(e) {
			if ("true" == this.parentNode.uiComp.node.getAttribute("selectable")) {
				this.parentNode.uiComp.items.removeClass("sel");
				$(this).addClass("sel");
			}
		}
	});
}
