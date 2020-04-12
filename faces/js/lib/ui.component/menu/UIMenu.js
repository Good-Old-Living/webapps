ui.init_menu = function(node) {
	return new UIMenu(node);
}

function UIMenu(nd) {
	UIComp.call(this, nd);
};

UIMenu.prototype = new UIComp();

UIMenu.prototype.init = function() {
	
}

