ui.init_wizard = function(node) {
	return new UIWizard(node);
}

function UIWizard(nd) {
	this.bc = $($("ul", $(nd))[0]);
	this.wc = $($(".wizardContent", $(nd))[0]);
	this.prevBut = $($(".back", $(nd))[0])
	this.proceedBut = $($(".proceed", $(nd))[0])
	UIComp.call(this, nd);
};

UIWizard.prototype = new UIComp();

UIWizard.prototype.init = function() {

	var lis = $("li", this.bc);
	
	lis.click(function() {
		this.parentNode.parentNode.uiComp.selectBC('c', this);
	})
	
	$(lis[0]).addClass("sel");
	var wis = $(".wizardItem", this.wc);
	
	$(wis[0]).addClass("sel");
	
	var fn = lis[0].getAttribute("listener");
	if (sys.isValid(fn)) eval(fn + ".onSelect(lis[0])");
	
	this.prevBut.click(function() {
		this.parentNode.parentNode.uiComp.prev();
	});

	this.proceedBut.click(function() {
		this.parentNode.parentNode.uiComp.next();
	});
}

UIWizard.prototype.selectBC = function(type, li, noListener) {
	var sli = $(".sel", this.bc);
	var fn = sli[0].getAttribute("listener");
	var l;
	switch (type) {
	case 'n':
		var p = true;
		if (noListener != false && sys.isValid(fn)) {
			p = eval(fn + ".proceed()");
		}
		if (p) {
			l = sli.next();
			if (l.length == 0)
				return;
		} else
			return;
		break
	case 'p':
		if (sys.isValid(fn)) {
			var r = eval(fn + ".prev()");
		}
		l = sli.prev();
		break
	default:
		l = $(li);
	}

	sli.removeClass("sel");
	l.addClass("sel");
	
	var nfn = l[0].getAttribute("listener");
	if (sys.isValid(nfn)) eval(nfn + ".onSelect(l[0])");

	var c = document.getElementById(l.attr("cid"));
	var wclis = $(".sel", this.wc);
	wclis.removeClass("sel");
	$(c).addClass("sel");
	var pbDisp = (l.prev().length == 0) ? "none" : "block";
	this.prevBut.css("display", pbDisp);
	
}

UIWizard.prototype.next = function() {
	this.selectBC('n');
}

UIWizard.prototype.prev = function() {
	this.selectBC('p');
}

UIWizard.prototype.show = function() {

	ui.overlay.show();
	$(this.node).hide().fadeIn(500);
	this.center();
}

UIWizard.prototype.hide = function() {
	$(this.node).fadeOut(500);
	ui.overlay.hide();
}