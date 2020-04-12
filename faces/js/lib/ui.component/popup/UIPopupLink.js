ui.init_popupLink = function(node) {

	node.onclick = function(e) {
		
		jsEvent.preventDefault(e);
		ui.popupLink.load(node);
	}
}

ui.popupLink = {
		loadByLinkId : function(linkId, parent) {
			var link = document.getElementById(linkId);
			ui.popupLink.load(link, parent);

		}
,
	load : function(link, parent) {
		ui.popup.closeAll();
		
		if (!sys.isValid(link.popup)) {
			var src = link.getAttribute("src");
			if (sys.isValid(src)) {
				var popup = ui.page.section.appendXHtml(src);
				link.popup = popup;
			}
		}
		if (!sys.isValid(parent))
			parent = link;
		//link.popup.uiComp.show(parent);
		
		ui.overlay.show();
		$(link.popup).hide().fadeIn(500);
		link.popup.uiComp.center();
		
		document.focusFirstInput(link.popup.uiComp.node);
				
	}
}