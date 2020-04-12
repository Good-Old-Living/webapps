ui.init_imageSlider = function(node) {
	return new UIImageSlider(node);
}

function UIImageSlider(nd) {
	UIComp.call(this, nd);
};

UIImageSlider.prototype = new UIComp();

UIImageSlider.prototype.init = function() {
	
}

