ui.init_window = function(node) {
	return new UIWindow(node);
}

function UIWindow(nd) {
	UIComp.call(this, nd);
};

UIWindow.prototype = new UIComp();

UIWindow.prototype.show = function(url, name, width, height) {

	var sX = window.screenX ? window.screenX : window.screenLeft;
	var sY = window.screenY ? window.screenY : window.screenTop;

	var sWidth = window.outerWidth ? window.outerWidth
			: document.getBody().clientWidth;

	var sHeight = window.outerHeight ? window.outerHeight
			: (document.getBody().clientHeight - 25);
	var left = parseInt(sX + ((sWidth - width) / 2), 10);
	var top = parseInt(sY + ((sHeight - height) / 2.5), 10);

	var features = ('left=' + left + ',top=' + top + ',width=' + width
			+ ',height=' + height);

	var win = window.open(url, "", features);

	if (win.focus)
		win.focus();
	return win;
}

UIWindow.prototype.hide = function(node) {
	if (sys.isValid(node))
		node.style.display = "none";

	else {
		$('.window').css("display", "none");
	}
	ui.overlay.hide();

}
