function CartPipe(buyDiv) {
	this.buyDiv = $(buyDiv);
	pIdDiv = $(".buyProdId", this.buyDiv);
	this.pId = $(pIdDiv).text();
	this.qtyInp = $(".qty", this.buyDiv)[0];
	this.qtyInp.onchange = this.addInputItem;
	this.addBut = $(".addCart", this.buyDiv)[0];
	this.addBut.onclick = this.addShoppingCartItem;
	this.adding = false;
	this.rmBut = $(".rmCart", this.buyDiv)[0];
	this.rmBut.onclick = this.removeShoppingCartItem;
}

CartPipe.prototype.addInputItem = function(e) {
	
	var cPipe = this.parentNode.parentNode.cartPipe;
	cPipe.adding = true;
	cPipe.flow();
}

CartPipe.prototype.addShoppingCartItem = function(e) {
	
	var cPipe = this.parentNode.cartPipe;
	if (cPipe.adding)
		return;
	cPipe.adding = true;
	cPipe.incQty();
	cPipe.flow();
	$(cPipe.rmBut).css("display", "block");
}

CartPipe.prototype.removeShoppingCartItem = function(e) {
	var cPipe = this.parentNode.cartPipe;
	if (cPipe.adding)
		return;
	
	var qty;
	
	if (!sys.isValid(cPipe.qtyInp.value))
		return;
	
	try {
		qty = parseInt(cPipe.qtyInp.value);
	} catch (e) {
		return;
	}
 
	if (qty >= 1) {
		qty--;
		cPipe.qtyInp.value = qty;
	}
	
	cPipe.flow();
	
	if (qty < 1) {
		cPipe.qtyInp.value = "";
		$(cPipe.rmBut).css("display", "none");
	}
	
}

CartPipe.prototype.checkAvailability = function() {
	
}

CartPipe.prototype.incQty = function() {
	var qty;
	if (this.qtyInp.value == "") {
		qty = 0;
	} else {
		qty = this.validQty();
		if (qty == null)
			return;
	}
	qty++;
	this.qtyInp.value = qty;

}

CartPipe.prototype.validQty = function() {

	if (!sys.isValid(this.qtyInp.value))
		return 1;
	var qty;
	if (this.qtyInp.value == "") {
		this.qtyInp.value = "1";
	}

	try {
		qty = parseInt(this.qtyInp.value);
	} catch (e) {
		alert("Please provide a valid value " + this.qtyInp);
		return null;
	}

	if (qty < 0 || isNaN(qty)) {
		alert("Pleaes provide a valid value" + this.qtyInp.value);
		return null;
	}
	return qty;
}

CartPipe.prototype.flow = function() {

	if (!sys.isValid(this.pId))
		return;

	var pQty = this.validQty();
	if (!sys.isValid(pQty))
		return;

	//var imgCont = this.buyDiv.parent().parent().parent();
	var imgCont = $(this.buyDiv).parents(".imgGrid");
	if (imgCont.length == 0 || imgCont[0].className.indexOf("imgGrid") == -1) {
		imgCont = $(".imgContainer");

	}

	var os = imgCont.offset();
	var px = os.left;
	var py = os.top;

	var cartIcon = $("#hdrCart");
	var cx = cartIcon.offset().left;
	var cy = cartIcon.offset().top;

	var gx = cx - px;
	var gy = cy - py;
	// alert(px+" "+py+" "+cx+" "+cy+" "+gx+" "+gy);
	var img = $("img", imgCont);
	var imgw = img.width() / 3;
	var imgh = img.height() / 3;
	var imgc = img.clone();
	imgc[0].pId = "" + this.pId;
	imgc[0].pQty = "" + pQty;
	imgc[0].pipe = this;

	imgc.prependTo(imgCont).css({
		'position' : 'absolute',
		'z-index' : '10'
	}).animate({
		opacity : 0.4
	}, 100).animate({
		opacity : 0.1,
		marginLeft : gx,
		marginTop : gy,
		width : imgw,
		height : imgh
	}, 1200, function() {
		$(this).remove();
		if (sys.isValid(this.pId) && sys.isValid(this.pQty)) {
			try {

				shoppingCart.addItem(this.pId, this.pQty);
				this.pipe.adding = false;
			} catch (e) {
				this.pipe.adding = false;
			}
		}
	});
}
