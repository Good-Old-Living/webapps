ui.init_inputText = function(node) {
	return new UITextField(node);
}

function UITextField(node) {
	this.node = node;
	if (this.monitorable()) {
		node.onkeyup = function(e) {
			if (!this.uiComp.isValid())
				this.uiComp.errorOut();
			else
				this.uiComp.clearError();
		}
	}

	$(node).focus(function(event) {
		this.uiComp.clearError();
	});

	if (!sys.isValid(node.value))
		this.setDefault();

	if (sys.isValid(node.getAttribute("help")))
		$("span", $(node.parentNode)).attr("title", node.getAttribute("help"));

}

UITextField.prototype.monitorable = function() {
	return sys.isValid(this.node.getAttribute("len"))
			|| sys.isValid(this.node.getAttribute("regex"));
};

UITextField.prototype.setDefault = function() {

	if (sys.isValid(this.node.getAttribute('default'))) {
		v = this.node.getAttribute("default");
		if (el.isVar(v)) {

			v = varHeap.get(el.getVarName(v));

		}


		if (this.node.nodeName == 'SELECT') {
			this.setSelectValue(v);
		} else
			this.node.value = v;
	}
};

UITextField.prototype.setSelectValue = function(value) {

	if (this.node.nodeName == 'SELECT') {
		var op;
		for (var i = 0; op = this.node.options[i++];) {
			if (op.value == value) {
				op.selected = true;
				break;
			}
		}
		this.node.options[0].selected = (op && !op.selected);
		
	}

};

UITextField.prototype.isValid = function() {
	var val = this.getValue();

	if (this.node.getAttribute("req") == 'true') {
		if (!sys.isValid(val))
			return false;
	} else if (val == "")
		return true;

	var l = this.node.getAttribute("len");
	if (sys.isValid(l) && val.length != l)
		return false;

	var reg = this.node.getAttribute("regex");
	if (sys.isValid(reg)) {
		if (!new RegExp(reg).test(val))
			return false;
	}

	return true;
};

UITextField.prototype.getValue = function() {
	var val = "";

	if (this.isCKEditor())
		val = CKEDITOR.instances[this.node.getAttribute("id")].getData();
	else {
		switch (this.node.getAttribute("type")) {
		case 'checkbox':
			val = (this.node.checked) ? 'Y' : 'N';
			break;
		default:
			val = this.node.value;
		}
	}

	return val;
};

UITextField.prototype.setValue = function(value) {
	if (!sys.isValid(value)) {
		value = "";
	}

	if (this.node.nodeName == 'SELECT') {
		this.setSelectValue(value);
	} else {

		switch (this.node.getAttribute("type")) {
		case 'checkbox':
			this.node.checked = (value == 'Y');
			break;
		case 'file':
			break;
		default:

			if (this.isCKEditor())
				CKEDITOR.instances[this.node.getAttribute("id")].setData(value);
			else
				this.node.value = value;
		}
	}
};

UITextField.prototype.clear = function() {
	if (this.node.type == 'submit') {
		return;
	}

	if (this.isCKEditor())
		CKEDITOR.instances[this.node.getAttribute("id")].setData("");
	else {

		switch (this.node.getAttribute("type")) {
		case 'checkbox':
			this.node.checked = false;
			break;

		default:

			this.node.value = "";
			this.setDefault();

		}
	}
}

UITextField.prototype.isCKEditor = function() {

	if (this.node.nodeName == "TEXTAREA") {
		var cs = this.node.getAttribute("class");
		if (sys.isValid(cs) && cs.indexOf("ckeditor") != -1)
			return true;
	}
	return false;
}

UITextField.prototype.errorOut = function() {
	$(this.node).css('background-color', '#fff7f6');
	$(this.getErrMsgDiv()).html("Error message");
}

UITextField.prototype.clearError = function() {
	$(this.node).css('background-color', '');
	this.clearErrMsgDiv();
}

UITextField.prototype.getErrMsgDiv = function() {
	var eDiv = $(".inputErrMsg", $(this.node.parentNode));
	if (eDiv.length == 0) {
		$("<div class='inputErrMsg'></div>").appendTo($(this.node.parentNode));
		eDiv = $(".inputErrMsg", $(this.node.parentNode));
	}

	return eDiv[0];
}

UITextField.prototype.clearErrMsgDiv = function() {
	var eDiv = $(".inputErrMsg", $(this.node.parentNode));
	if (eDiv.length > 0)
		$(eDiv[0]).html("");
}
