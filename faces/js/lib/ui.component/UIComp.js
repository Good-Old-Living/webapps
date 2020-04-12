ui.init_comp = function(node) {
	new UIComp(node);
};


function UIComp(node) {
	if (node) {
		this.node = node;
		this.width = node.offsetWidth;
		this.height = node.offsetHeight;
		
		if (typeof this.init == "function") {
			this.init();
		}
		this.binds();
	}
};

UIComp.prototype.getCN = function(nd) {
	
	if (!sys.isValid(nd)) nd = this.node; 
	return nd.getAttribute("c");
}

UIComp.prototype.center = function() {
	var c = $(this.node);
	var scrollTop = window.pageYOffset ? window.pageYOffset	: $("body")[0].scrollTop;

	var x = ($(window).width() / 2) - (c.width() / 2), y = scrollTop
			+ ($(window).height() / 2) - (c.height() / 2);
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	c.css({
		left : x,
		top : y
	});
};

UIComp.prototype.position = function(parent) {

	if (parent != undefined) {
        var bd = $('body'); 
		var scrollLeft = window.pageXOffset ? window.pageXOffset : bd.scrollLeft;
		var scrollTop = window.pageYOffset ? window.pageYOffset : bd.scrollTop;
		var docWidth = (window.innerWidth) ? window.innerWidth - 20 : bd.clientWidth - 20;
		var docHeight = (window.innerHeight) ? window.innerHeight - 18 : bd.clientHeight - 15

		var x;
		var y;
		
		var offset = $(parent).offset();
		var x = offset.left;
		var y = offset.top + parent.offsetHeight;
		x = (x + this.width - scrollLeft > docWidth) ? docWidth + scrollLeft
				- this.width : x // account for right edge
//		y = (y + this.height - scrollTop > docHeight) ? y - this.height
//				- parent.offsetHeight : y // account for bottom edge
			
		$(this.node).css({
			left : x,
			top : y
		});
	}
};

UIComp.prototype.binds = function() {
	
	var bs = this.node.getAttribute("binds");
	if (bs) {
		var en = [];
		en.push(EntityEventName.add(bs));
		en.push(EntityEventName.set(bs));
		
		var cb = function(ae) {
			var binds = this.source.node.getAttribute("binds");
			//this component does not want to be shown on select of an entity
			if (ae.name == EntityEventName.set(binds) && this.source.node.set == false) {
				this.source.node.style.display = "none";
				return;
			}
			
			var d = sys.isValid(ae.payload) || ae.name == EntityEventName.add(binds)? "block" : "none";
			this.source.node.style.display = d;
		}
		
		var ln = this.node.getAttribute("id");
		ln = (ln) ? ln+"." : "";
		ln += "bx."+bs;
		
		eventQueue.mlistener(en,new AppEventListener(ln, cb, this));
	}
}

function closeable(node) {
	
	var c = $("<div class='closeable'/>").appendTo($(node));
	c[0].onclick = function() {
		this.parentNode.uiComp.hide();
	}
}


