ui.init_dialog = function(node) {
	return new UIDialog(node);
}

function UIDialog(nd) {
	UIComp.call(this, nd);
	closeable(nd);
};

UIDialog.prototype = new UIComp();

UIDialog.prototype.show = function() {
	if (this.node.parentNode.nodeName != "BODY") {
		this.node.parentNode.removeChild(this.node);
		$("body").append($(this.node));
	}

	ui.overlay.show();
	$(this.node).hide().fadeIn(500);
	this.center();
}

UIDialog.prototype.hide = function() {
	$(this.node).fadeOut(500);
	ui.overlay.hide();
}