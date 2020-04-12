ui.init_popup = function(node) {
	return new UIPopup(node);
}

ui.popup = {
	closeAll : function() {
		$(".popup").fadeOut(500);
		ui.overlay.hide();
	},
	show : function(popupId, parent) {
		var popupNd = document.getElementById(popupId);
		alert(popupNd);
		popupNd.uiComp.show(parent);
	}
}

function UIPopup(nd) {
	UIComp.call(this, nd);
};

UIPopup.prototype = new UIComp();

UIPopup.prototype.init = function() {

	$(".popupClose", $(this.node)).click(function() {
		ui.overlay.hide();
		$(this).parent().parent().fadeOut(500);
	});
}

UIPopup.prototype.show = function(parentNd) {
	$(this.node).hide().fadeIn(500);
	this.position(parentNd);
	ui.input.focus(this.node);
}

UIPopup.prototype.hide = function() {
	$(this.node).fadeOut(500);
}
