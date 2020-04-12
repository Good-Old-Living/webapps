ui.init_imageGallery = function(node) {
	return new UIImageGallery(node);
}

function UIImageGallery(nd) {
	UIComp.call(this, nd);
};

UIImageGallery.prototype = new UIComp();

UIImageGallery.prototype.init = function() {
	
	
}

