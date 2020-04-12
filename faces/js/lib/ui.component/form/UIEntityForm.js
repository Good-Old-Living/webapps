ui.init_entityForm = function(node) {
	return new UIEntityForm(node);
}

function UIEntityForm(nd) {
	this.entityName = nd.getAttribute("entity");
	this.eAlias = nd.getAttribute("var");
	UIComp.call(this, nd);
};

UIEntityForm.prototype = new UIComp();

UIEntityForm.prototype.init = function() {
	var ln = this.eAlias + "-form";

	var eAdd = EntityEventName.add(this.eAlias);

	var addCB = function(ae) {
		this.source.clear();
	}
	eventQueue.listener(eAdd, new AppEventListener(ln, addCB, this));

	var eRm = EntityEventName.removed(this.eAlias);
	var rmCB = function(ae) {
		this.source.clear();
	}
	eventQueue.listener(eRm, new AppEventListener(ln, rmCB, this));

	var eSet = EntityEventName.set(this.eAlias);
	var setCB = function(ae) {
		this.source.populate(ae.payload);
	}
	eventQueue.listener(eSet, new AppEventListener(ln, setCB, this));

	var saveBut = document.getElementById(this.eAlias + "Submit");
	if (sys.isValid(saveBut)) {
		saveBut.eform = this;
		saveBut.onclick = function() {
			this.eform.submit();
			return false;
		}
	}
};

UIEntityForm.prototype.clear = function() {

	document.eachInput(this.node, function(inp) {
		if (inp.uiComp) {
			inp.uiComp.clear();
		}
	});

	if (eval("typeof post_" + this.eAlias + "New") == "function")
		eval("post_" + this.eAlias + "New()");

};

UIEntityForm.prototype.enableInputs = function() {

	document.eachInput(this.node, function(inp) {
		inp.disabled = false;
	});

};

UIEntityForm.prototype.disableInputs = function() {

	document.eachInput(this.node, function(inp) {
		inp.disabled = true;
	});
};

UIEntityForm.prototype.getEntity = function() {

	var o = {};
	o.form = this;
	o.entity = {};
	document.eachInput(this.node, function(node, o) {
		if (node.type != 'submit' && sys.isValid(node.name)) {
			o.form.addInputValue(o.entity, node, node.name);
		}
	}, o);

	return o.entity;
};

UIEntityForm.prototype.addInputValue = function(object, inputElem, inputName) {

	var index = inputName.indexOf(".");
	if (index == -1) {
		var val;
		if (inputElem.type == "radio") {
			if (inputElem.checked)
				object[inputName] = inputElem.value;
		} else
			object[inputName] = (inputElem.uiComp) ? inputElem.uiComp
					.getValue() : inputElem.value;
	} else {
		var parent = inputName.substr(0, index);
		var curr = object;
		if (parent != this.eAlias) {
			curr = jsObject.getAttrValue(object, parent);

			if (curr == null) {
				curr = {};
				object[parent] = curr;
			}
		}

		this.addInputValue(curr, inputElem, inputName.substr(index + 1));
	}
};

UIEntityForm.prototype.setEntityById = function(entityId) {
	var entity = entityStore.get(this.entityName, entityId);
	this.setEntity(entity);
}

UIEntityForm.prototype.setEntity = function(entity) {

	var e = jsObject.wrap(this.eAlias, entity);
	var o = {
		form : this,
		entity : e
	};

	document.eachInput(this.node, function(node, o) {
		if (node.type != 'submit'/* && sys.isValid(node.name ) */) {
			o.form.setInputValue(node, o.entity);
		}
	}, o);
};

UIEntityForm.prototype.setInputValue = function(input, entity) {

	if (input.type != 'submit') {
		if (sys.isValid(input.getAttribute("expr")))
			value = el.substitute(input.getAttribute("expr"), entity, true);
		else
			value = jsObject.getAttrValue(entity, input.name);

		if (input.uiComp)
			input.uiComp.setValue(value);
	}

};

UIEntityForm.prototype.populate = function() {
	var entity = varHeap.get(this.eAlias);
	if (sys.isValid(entity))
		this.setEntity(entity);
	else
		this.clear();

	if (eval("typeof post_" + this.eAlias + "View") == "function")
		eval("post_" + this.eAlias + "View(entity)");
	return entity;
};

UIEntityForm.prototype.validate = function() {

	var inputElems = this.node.getElementsByTagName("input");
	var isValid = true;
	if (!this.isInputValid(inputElems)) {
		isValid = false;
	}
	inputElems = this.node.getElementsByTagName("select");

	if (!this.isInputValid(inputElems)) {
		isValid = false;
	}
	inputElems = this.node.getElementsByTagName("textarea");
	if (!this.isInputValid(inputElems)) {
		isValid = false;
	}

	return isValid;

};

UIEntityForm.prototype.isInputValid = function(inputElems) {

	var isValid = true;
	for (var i = 0, elem; elem = inputElems[i++];) {

		if (elem.type == 'submit' || elem.type == 'hidden')
			continue;
		if (elem.uiComp && !elem.uiComp.isValid()) {
			elem.uiComp.errorOut();
			isValid = false;
		}
	}

	return isValid;
};

UIEntityForm.prototype.submit = function() {

	if (!this.validate()) {
		ui.messageBox.show("One or more invalid inputs found.");
		return;
	}

	if (this.isMultiPart()) {
		var url = entityStore.idPath(this.entityName);

		var iframe = document.createElement("iframe");
		iframe.setAttribute("name", "iframe1");
		iframe.setAttribute("id", "iframe1");
		iframe.setAttribute("src", "javascript:false;");
		iframe.style.display = 'none';
		document.getBody().appendChild(iframe);

		this.node.setAttribute("method", "post");
		this.node.setAttribute("action", entityStore.server.absURL(url));
		this.node.setAttribute("onsubmit", "");
		this.node.setAttribute("target", "iframe1");
		this.node.submit();

		iframe.sform = this;
		iframe.onload = function() {
			var entity = this.sform.getEntity();
			var isNew = !sys.isValid(entity['id']);
			entity = this.sform.getMultipartResponse(iframe);
			try {
				entity = entityStore.parse(entity);
				this.sform.postSave(entity, isNew);
			} catch (e) {
				alert(e);
			}
		}

	} else {

		var entity = this.getEntity();

		if (eval("typeof pre_" + this.eAlias + "Save") == "function")
			eval("pre_" + this.eAlias + "Save(entity)");

		var isNew = !sys.isValid(entity['id']);
		try {
			entity = entityStore.save(this.entityName, entity);
		} catch (e) {
			if (e.message)
				alert(e.message);
			else
				alert(e)
			throw e;
		}
		this.postSave(entity, isNew);
		return entity;
	}
};

UIEntityForm.prototype.postSave = function(entity, isNew) {

	if (!sys.isFalse(this.node.getAttribute("status"))) {

		var msg = this.node.getAttribute("message");
		if (!sys.isValid(msg))
			msg = this.node.getAttribute("successMsg");
		if (msg != 'null') {
			if (!msg)
				msg = "The requested operation has been completed successfully";
			ui.statusBar.show(msg);
		}
	}

	var lnr = this.eAlias + "Listener";
	if (eval("typeof " + lnr) == "object"
			&& eval("typeof " + lnr + ".postSave") == "function")
		eval(lnr + ".postSave(entity)");

	varHeap.set(this.eAlias, entity);
	// this.setEntity(entity);
	var e = new AppEvent(EntityEventName.saved(this.eAlias), entity);
	e.isNew = isNew;
	eventQueue.fire(e);
};

UIEntityForm.prototype.isMultiPart = function() {

	var enctype = this.node.getAttribute("enctype");
	return (sys.isValid(enctype) && enctype.toLowerCase() === 'multipart/form-data');
}

UIEntityForm.prototype.getMultipartResponse = function(iframe) {

	var doc = iframe.contentDocument ? iframe.contentDocument
			: window.frames[iframe.id].document;

	if (doc.XMLDocument)
		response = doc.XMLDocument;
	else if (doc.body) {
		response = doc.body.innerHTML;
		if (response) {
			if (doc.body.firstChild
					&& doc.body.firstChild.nodeName.toUpperCase() == 'PRE') {
				response = doc.body.firstChild.firstChild.nodeValue;
			}
		}
	} else
		response = doc;

	setTimeout(function() {
		document.getBody().removeChild(iframe);
	}, 0);

	return response;
};
