ui.input = {

	focus : function(pNd) {
		var ins = $("input", $(pNd));
		for ( var i = 0, inp; inp=ins[i++];) {
			if (inp.getAttribute("type") == "text") {
				inp.focus();
				break;
			}
		}
	}
}

ui.init_inputHidden = function(node) {
	return new UITextField(node);
}

ui.init_inputDecimal = function(node) {
	return new UITextField(node);
}

ui.init_inputInt = function(node) {
	return new UITextField(node);
}

ui.init_inputTextarea = function(node) {
	return new UITextField(node);
}

ui.init_inputFile = function(node) {
	return new UITextField(node);
}

ui.init_selectBooleanCheckBox = function(node) {
	return new UITextField(node);
}

ui.init_selectOneEntityMenu = function(node) {
	return new UITextField(node);
}

ui.init_inputRuledTextarea = function(node) {
	node.inputText = new UITextField(node);
	node.counter = 1;
	node.onkeydown = function(e) {
		if (this.value == "") this.value = this.counter+". ";
	}
	node.onkeyup = function(e) {
		e = eventSys.getEvent(e);
		var cd = eventSys.getCharCode(e);
		if (cd == 13) {
		  this.counter = this.counter + 1;
		  this.value = this.value+node.counter+". ";
		}
	}
}
