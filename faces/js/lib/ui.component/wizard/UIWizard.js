ui.init_wizard = function(node) {
	return new UIWizard(node);
}

function UIWizard(nd) {
	UIComp.call(this, nd);
	
};

UIWizard.prototype = new UIComp();

UIWizard.prototype.init = function() {
	
	var wItems = $(".wizardItem",this.node);
	
	$(wItems[0]).addClass("sel");
	
	var proceedButs = $(".proceed",$(this.node));
	
	proceedButs.click(function() {
		var wi = this.parentNode.parentNode;
		var ln = wi.getAttribute("listener");
		p = eval(ln + ".proceed()");
		
		if (p) {
			
			$(wi).removeClass("sel");
			$(wi.nextSibling).addClass("sel");
		}
		
	});
}

UIWizard.prototype.selectNext = function() {
	var sel = $(".sel", $(this.node));
	var ln = sel[0].getAttribute("listener");
	var l = sel[0].parentNode.nextSibling;
	var ns =  $(".wizardItem", $(l));
    
	sel.removeClass("sel");

	
	var nfn = l.getAttribute("listener");
	if (sys.isValid(nfn)) eval(nfn + ".onSelect(l)");
	$(ns).addClass("sel");
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