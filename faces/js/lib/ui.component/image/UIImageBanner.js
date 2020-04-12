ui.init_imageBanner = function(node) {
	return new UIImageBanner(node);
}

function UIImageBanner(nd) {
	UIComp.call(this, nd);
};

UIImageBanner.prototype = new UIComp();

UIImageBanner.prototype.init = function() {
	
	var lis = $("li", $(this.node));
	
	var bannerImgDiv = $(".bannerImg", $(this.node))[0];
	var bannerImg = $("img", $(bannerImgDiv))[0];
	
	var fn = function(li) {
		li.bannerImg.style.display = "none";
		li.bannerImg.src = li.getAttribute("img-src");
		$(li.bannerImg).fadeIn(500);
		$("div", $(li.parentNode)).removeClass("sel");
		$("div", $(li)).addClass("sel");
	}
	
	for (var i=0, li; li=lis[i++];) {
		
		li.bannerImg = bannerImg;
		li.nextLi = (i == lis.length) ? lis[0] : lis[i];
		
		li.onmouseover = function(e) {
			fn(this);
		}
	}
	
	setInterval(function() {
		
		var lis = $(".sel", ".imageBanner");
		fn(lis[0].parentNode.nextLi);
	}, 5000);
	
}

