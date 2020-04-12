ui.init_imageScroller = function(node) {
	return new UIImageScroller(node);
}

function UIImageScroller(nd) {
	this.imgContainer = $($(".ulDivIn", $(nd))[0]);
	
	this.pos = 0;

	var lis = $("li",this.imgContainer);
	
	this.imgCount = lis.length;
//	this.prevNd = $(".prev", $(nd))[0];
//	this.nextNd = $(".next", $(nd))[0];
	UIComp.call(this, nd);
};

UIImageScroller.prototype = new UIComp();

UIImageScroller.prototype.init = function() {

//	this.prevNd.onclick = function(e) {
//		this.parentNode.parentNode.uiComp.prev();
//	}
//	
//	this.nextNd.onclick = function(e) {
//		this.parentNode.parentNode.uiComp.next();
//	}
//	this.prevNd.style.visibility = "hidden";
	
	
	
	if (this.node.parentNode.getAttribute("c") == "imageGallery") {
		
		var vImgDiv = $(".vimg", $(this.node.parentNode))[0];
		
		$(vImgDiv).html("<img style='"+vImgDiv.getAttribute("style")+"'/>");
		var lis = $("li", this.imgContainer);
		var vImg = $("img", $(vImgDiv))[0];
		
		if (lis.length > 0) vImg.src = lis[0].getAttribute("lsrc");
		
		for (var i=0,li; li=lis[i++];) { 
			li.vImg = vImg;
			li.onmouseover = function() {
				this.vImg.src = this.getAttribute("lsrc");
				$(this.vImg).hide().fadeIn(1000);
			}
		}
	}
	
};

UIImageScroller.prototype.next = function() {
	this.pos++;
	
	this.imgContainer.animate({ "left": "-=110px" }, 500, "slow" );
	
	if (this.pos == this.imgCount-1) this.nextNd.style.visibility = "hidden";
	else this.nextNd.style.visibility = "";

	this.prevNd.style.visibility = "";
}

UIImageScroller.prototype.prev = function() {
	console.log(this.pos);
	if (this.pos > 0) {
		this.pos--;
		this.imgContainer.animate({ "left": "+=110px" }, "slow" );
		this.prevNd.style.visibility = "";
	}
	
	if (this.pos == 1)
		this.prevNd.style.visibility = "hidden";
	
	this.nextNd.style.visibility = "";
}

