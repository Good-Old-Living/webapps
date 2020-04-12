ui.init_tree = function(node) {
	return new UITree(node);
}


ui.init_entityTree= function(node) {
	return new UITree(node);
}

function UITree(nd) {
	UIComp.call(this, nd);
}

UITree.prototype = new UIComp();


UITree.prototype.init = function() {
    
	var tree = $(this.node);
	var thisObj = this;
	var id = this.node.getAttribute("id");
	
	var options = {};
    options.duration = 1000;
    options.easing = null;
	$('.folderIcon', tree).click(function(e) {
		jsEvent.preventDefault(e);
		var comp = $(this.parentNode);
		var nds = this.parentNode.parentNode.childNodes;
		for (var i=0, nd; nd=nds[i++];) {
			if (nd.nodeName == "UL") {
				if (this.parentNode.className.indexOf('collapsed') != -1) {
					$(nd).slideDown( {
			              duration : options.duration,
			              easing : options.easing
			          });
					comp.removeClass('collapsed').addClass('expanded');
					
				}
				else {
					$(nd).slideUp( {
			            duration : options.duration,
			            easing : options.easing
			        });
					comp.removeClass('expanded').addClass('collapsed');
				}
			}
		}
		
	});
	
	$(".treeNode", tree).click(function() {
		var pN = $(".selected", tree)[0];
		
		if (sys.isValid(pN)) {
			$(pN).removeClass("selected");
		}
		$(this).addClass("selected");
		if (sys.isValid(this.getAttribute("href")))
			eval(this.getAttribute("href"));
	});
	
};