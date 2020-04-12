ui.init_dataTable = function(node) {
	return new UIDataTable(node);
}

ui.init_entityTable = function(node) {
	return new UIDataTable(node);
}

function UIDataTable(nd) {
	this.entityName = nd.getAttribute("entity");
	this.filter = nd.getAttribute("filter");
	this.eAlias = nd.getAttribute("var");
	this.name = this.eAlias + "Table";

	this.gridRows = $($('.gridRows', $(nd))[0]);

	this.selectedRow = null;

	UIComp.call(this, nd);
};

UIDataTable.prototype = new UIComp();

UIDataTable.prototype.init = function() {

	this.addFilterListeners();
	this.addEventHandlers();

	var eAdd = EntityEventName.add(this.eAlias);
	var addCB = function(ae) {
		this.source.clearSelection();
	}
	eventQueue.listener(eAdd, new AppEventListener(this.name, addCB, this));

	var eRm = EntityEventName.remove(this.eAlias);
	var rmCB = function(ae) {
		this.source.deleteSelectedEntity();
	}
	eventQueue.listener(eRm, new AppEventListener(this.name, rmCB, this));

	var eSd = EntityEventName.saved(this.eAlias);
	var sdCB = function(ae) {
		this.source.update(ae.payload, ae.isNew);
	}
	eventQueue.listener(eSd, new AppEventListener(this.name, sdCB, this));
};

UIDataTable.prototype.addFilterListeners = function() {
	if (this.filter && el.containsVar(this.filter)) {
		var varas = el.getVarNames(this.filter);
		for (var j = 0, vara; vara = varas[j++];) {

			var v = vara.substring(0, vara.indexOf("."))

			if (sys.isValid(v)) {

				var en = EntityEventName.set(v);
				var cb = function(ae) {
					this.source.load();
				}
				eventQueue.listener(en, new AppEventListener(this.name, cb,
						this));
			}
		}
	}
};

UIDataTable.prototype.attachEventHandlers = function() {
	if (sys.isTrue(this.node.getAttribute("removeable"))) {
		trs = $(".removeable", this.gridRows);

		for (var i = 0, rm; rm = trs[i++];) {
			rm.entity = this.entityName;
			rm.onclick = function(e) {
				jsEvent.preventDefault(e);
				var tr = this.parentNode.parentNode;
				var eid = tr.getAttribute("eid");
				entityStore.remove(this.entity, eid);
				var tb = tr.parentNode;
				tr.parentNode.removeChild(tr);
			}
		}
	}

	var rs = this.node.getAttribute("rowSelection");
	if (rs != 'none') {
		var trs = $("tr", this.gridRows);
		for (var i = 0, tr; tr = trs[i++];) {
			tr.regClass = tr.className;
			this.attachRowSelection(tr);
		}

		var headerRow = $('.headerRow', $(this.node));
		var rs = $('.rowSelection', $(headerRow[0]));
		if (sys.isValid(rs[0])) {
			var cb = $('input', $(rs[0]));
			cb[0].onclick = function(e) {
				var gridRows = this.parentNode.parentNode.parentNode.uiComp.gridRows;
				var dataRows = $(".rsCheck", gridRows);
				for (var i = 0, row; row = dataRows[i++];) {
					row.checked = this.checked;
				}
			}
		}
	}
}

UIDataTable.prototype.addEventHandlers = function() {

	xhtmlParser.callAfterParse(function(nd) {
		nd.uiComp.attachEventHandlers();
	}, this.node);
};

UIDataTable.prototype.attachRowSelection = function(tr, select) {
	tr.onclick = function(e) {

		if (!sys.isValid(this.parentNode))
			return;

		var dataTable = this.parentNode.parentNode.parentNode.parentNode.uiComp;
		if (sys.isValid(dataTable)) {
			
			if (dataTable.selectedRow != null) {
				//dataTable.selectedRow.className = dataTable.selectedRow.regClass;
				$(dataTable.selectedRow).removeClass("selected");
			}
			if (!sys.isValid(this.regClass)) {
				this.regClass = "";
			}
			this.className = this.regClass + " selected";
			dataTable.selectedRow = this;
			e = jsEvent.event(e);
			dataTable.setSelection(e, this);
		}
	}
	if (select)
		this.selectRow(tr);
};

UIDataTable.prototype.clearSelection = function() {

	var selRows = $(".selected", this.gridRows);
	if (selRows.length > 0) {
		var selRow = selRows[0];
		selRow.className = selRow.className.substring(0, selRow.className
				.indexOf(" selected"));
	}
};

UIDataTable.prototype.setSelection = function(e, row) {

	if (!e)
		e = {};
	var value, entity;
	if (row) {
		value = row.getAttribute("eid");
		if (sys.isValid(value))
			entity = entityStore.get(this.entityName, value);
	}

	varHeap.set(this.eAlias, entity);
};

UIDataTable.prototype.selectRow = function(row) {

	this.clearSelection();
	row.className = row.className + " selected";
};

UIDataTable.prototype.update = function(entity, isNew) {

	entity = jsObject.wrap(this.eAlias, entity);

	var strBuilder = new StringBuilder();
	if (isNew) {
		this.addRow(entity, strBuilder, false);
		var trs = $("tr", this.gridRows)[0];
		if (!sys.isValid(trs) || trs.className.indexOf("noItems") >= 0)
			this.gridRows.html(strBuilder.toString());
		else
			$(strBuilder.toString()).appendTo(this.gridRows);
		trs = $("tr", this.gridRows);
		this.attachRowSelection(trs[trs.length - 1], true);
	} else {
		var eid = entity[this.eAlias]['id'];
		var trs = $("tr", this.gridRows);
		for (var i = 0, tr; tr = trs[i++];) {
			var rid = tr.getAttribute("eid");
			if (rid === eid) {
				this.updateRow(tr, entity);

			}
		}
	}

};

UIDataTable.prototype.addRow = function(entity, strBuilder, isEven) {

	var headers = $('.headerRow', $(this.node))[0].childNodes;

	strBuilder.append("<tr valign='middle'");
	if (isEven) {
		strBuilder.append(" class='even'");
	}
	
	strBuilder.append(" eid='").append(entity[this.eAlias]['id']).append("'>");

	this.buildRow(entity, headers, strBuilder);

	strBuilder.append("</tr>");
};

UIDataTable.prototype.updateRow = function(row, entity, isEven) {

	var strBuilder = new StringBuilder();
	var headers = $('.headerRow', $(this.node))[0].childNodes;
	this.buildRow(entity, headers, strBuilder);
	$(row).html(strBuilder.toString());
};

UIDataTable.prototype.buildRow = function(entity, headers, strBuilder) {

	var cellRenderer = this.node.getAttribute("cellrenderer");

	for (var j = 0, header; header = headers[j++];) {

		if (typeof header.getAttribute == 'undefined') {
			continue;
		}

		if (header.className == "removeable") {
			strBuilder
					.append("<td width='20'><div class='removeable'></div></td>");
			continue;
		}

		var rsel = header.getAttribute("rowSelection");
		if (rsel == "multiple") {
			strBuilder
					.append("<td width='20' class='rowSelection'><input type='checkbox' class='rsCheck'/></td>");
		} else {
			var attr = header.getAttribute("value");
			var width = header.getAttribute("width");

			if (width)
				var cssWidth = width + "px";

			var align = header.getAttribute("align");
			if (!sys.isValid(align)) {
				align = "left";
			}

			var value;

			if (sys.isValid(cellRenderer)) {
				value = eval(cellRenderer + "(entity,attr)");
			} else {

				if (sys.isValid(attr)) {

					if (sys.isValid(header.getAttribute("idx"))) {

						var idx = header.getAttribute("idx");
						
						if (sys.isValid(header.getAttribute("e"))) {
						
						   var obj = jsObject.getAttrValue(entity, header
							  	.getAttribute("e"));
						
						   if (obj && obj.length) {
							 //dynamic columns, each row can have varying number of columns
							   value = "<table><tr>";
							   for (var k = 0, e; e= obj[k++];) {
								   value += "<td>" +((sys.isValid(obj)) ? el.substitute(attr, e, true) : "")+"</td>";
							   }
							   
							   value += "</tr></table>";
						   } 
						   else 	   
  						     value = (sys.isValid(obj)) ? el.substitute(attr, obj[idx - 1], true) : "";
						}
						else {
							
							value = (sys.isValid(entity)) ? el.substitute(attr, entity, true) : "";
						}
					}

					else 
						value = el.substitute(attr, entity, true);
				}
				
				if (sys.isValid(header.getAttribute("href"))) {
					var href = header.getAttribute("href");
					href = el.substitute(href, entity, true);
					value = "<a href='"+href+"' target='_blank'>"+value+"</a>";
				}
			}

			strBuilder.append("<td width='" + width + "'><div style='width:")
					.append(cssWidth).append(";text-align:").append(align)
					.append("'>").append(value).append("</div></td>");
		}

	}
};

UIDataTable.prototype.getSelectedRow = function() {
	var trs = $("tr.selected", this.gridRows);
	if (trs.length > 0) 
		return trs[0];
	return null;	
};



UIDataTable.prototype.getSelectedEntityIds = function(showMsg) {

	var trs = $("tr", this.gridRows);
	var strBuilder = new StringBuilder();
	for (var i = 0, tr; tr = trs[i++];) {
		if ($("input", $(tr))[0] && $("input", $(tr))[0].checked) {
			if (strBuilder.length() > 0)
				strBuilder.append(",");
			strBuilder.append(tr.getAttribute("eid"));
		}
	}

	if (strBuilder.length() == 0) {
		if (showMsg)
		   ui.messageBox.show("Please select entities");
		throw "Please select entities";
	}

	return strBuilder.toString();
};

UIDataTable.prototype.deleteSelectedEntity = function() {

	var sRow = $(".selected", this.gridRows);
	var entityId = $(sRow[0]).attr("eid");

	if (!sys.isValid(entityId)) {
		alert("Please select a row to delete");
		return null;
	}

	if (entityId != null && confirm("Do you really want to delete?")) {

		entityStore.remove(this.entityName, entityId);
		sRow[0].parentNode.removeChild(sRow[0]);
		this.setSelection();
	}
};

UIDataTable.prototype.load = function(filter) {

	if (!sys.isValid(filter))
		filter = this.filter;

	if (sys.isValid(filter)) {
		try {
			filter = el.substitute(filter);
		} catch (e) {
			if (typeof e == 'string' && e.startsWith("No value")) {
			} else {
				alert(e);
			}
			this.emptyTable();
			throw e;
		}
	}

	try {
	
	var entities = entityStore.mget(this.entityName, filter);
	if (sys.isValid(entities))
		entities = entities['items'];
	if (!sys.isValid(entities) || entities.length == 0)
		this.emptyTable();
	else {
		var strBuilder = new StringBuilder();
		var isEven = false;
		if (sys.isTrue(this.node.getAttribute("dynamic")))
			this.addHeaders(entities[0]);
		var res = {};
		for (var i = 0, entity; entity = entities[i++];) {
			res[this.eAlias] = entity;
			this.addRow(res, strBuilder, isEven);
			isEven = !isEven;
		}
		var table = $(this.node);
		this.gridRows.html(strBuilder.toString());
		this.attachEventHandlers();
		this.setSelection();

		var rs = $(".rowSelection", table)

		if (rs.length > 0)
			$("input", $(rs[0]))[0].checked = false;
	  
	}
	} catch (e) {
		alert(e)
		throw e;
	}
};

UIDataTable.prototype.addHeaders = function(entity) {

	var dhdRow = $('.dyHeaderRow', $(this.node))[0];
	var hdRow;
	if (sys.isValid(dhdRow))
		hdRow = dhdRow;
	else {
		hdRow = $('.headerRow', $(this.node))[0];
		var dh = "<tr class='dyHeaderRow'>" + $(hdRow).html() + "</tr>";
		$(hdRow.parentNode).append($.parseHTML(dh))
	}

	var headers = hdRow.childNodes;
	var sb = new StringBuilder();
	var dyHdr = null;
	for (var j = 0, header; header = headers[j++];) {
		if (header.nodeType == 1) {
			var dyCol = this.getCN(header); 
			if (dyCol == "entityColumns" || dyCol == "dynamicColumns") {
				dyHdr = header;
				break;
			}
			sb.append("<th ").append("width='").append(
					header.getAttribute("width")).append("' value='").append(
					header.getAttribute("value")).append("'>").append(
					$(header).html()).append("</th>");
		}
	}

	var lbl = dyHdr.getAttribute("label");
	
	var pEntity = dyHdr.getAttribute("entity");
	
	if (sys.isValid(lbl)) {
		
		if (!sys.isValid(pEntity)) {
			sb.append("<th idx='1' e='").append(el.getVarName(lbl)).append("' width='").append(
					dyHdr.getAttribute("width")).append("' value='").append(
					dyHdr.getAttribute("value")).append("'>").append("").append(
					"</th>");
		}
		else {
			if (sys.isValid(pEntity)) {
				entity = entityStore.mget(pEntity, dyHdr.getAttribute("filter"));
			}
			
			var ob = el.getVarExceptLastPart(lbl);
			var at = el.getVarLastPart(lbl);
			var r = {};
			if (ob.indexOf(".") > 0)
			  r[ob.substring(0, ob.indexOf("."))] = entity;
			else r[ob] = entity["items"];
			var ent = jsObject.getAttrValue(r, ob);
			if (sys.isValid(ent)) {
				for (var i = 0, en; en = ent[i++];) {
					var v = en[at];
		
					sb.append("<th ").append("idx='").append(i);
					sb.append("' e='").append(ob).append("' width='").append(
							dyHdr.getAttribute("width")).append("' value='").append(
							dyHdr.getAttribute("value")).append("'>").append(v).append(
							"</th>");
				}
			}
		}	
	}

	$('.headerRow', $(this.node)).html(sb.toString());

};

UIDataTable.prototype.emptyTable = function() {
	var h = "<tr height='100' valign='middle' class='noItems'><td align='center'><div style='line-height:100px;text-align:center'> -- No items found -- </div></td></tr>";
	this.gridRows.html(h);
};
