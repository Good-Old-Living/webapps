ui.init_stackedEntityGrid = function(node) {
	return new StackedEntityGrid(node);
}

function StackedEntityGrid(nd) {
	UIComp.call(this, nd);
};

StackedEntityGrid.prototype = new UIComp();

StackedEntityGrid.prototype.init = function() {
	$("li", $(this.node)).click(function() {
		
		var lis = $("li", $(this.parentNode));
		
	    lis.each(function() {
	    	$("#"+this.getAttribute("eid")).addClass("hidden");
	    	
	    })
	    
	    var i = this.getAttribute("eid");
	    var ig = $("#"+i);
	    ig.removeClass("hidden");
	    $("li", ig).removeClass("sel");
	    $("li[eid="+i+"]", ig).addClass("sel");
	}) 
	
};
